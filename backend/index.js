//require('dotenv').config()
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import example from './routes/example.routes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import room from './routes/room.routes.js';
import user from './routes/user.routes.js';
import message from './routes/message.routes.js';
import db from './models/index.js';
import { AckSuccess, AckError } from './misc/ackMessage.js';
import utils from './routes/utils.routes.js';
import boolParser from 'express-query-boolean';


dotenv.config();
const app = express();
const port = process.env.listenPort;

let maxClientsPerRoom;
let mongoUrl;
if (process.env.ENV === 'dev') {
	mongoUrl = process.env.mongoUrlDev;
	maxClientsPerRoom = process.env.maxClientsPerRoom;
} else {
	mongoUrl = process.env.mongoUrlTest;
	maxClientsPerRoom = process.env.maxClientsPerRoomTest;
}

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log(`Connected to the database! - [${process.env.ENV}]`);
	})
	.catch(err => {
		console.error(`Cannot connect to the database! - [${process.env.ENV}]`, err);
		process.exit();
	});

const corsOptions = {
	origin: [],
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

let corsOptionsSockets = {};

if ('corsUrls' in process.env && process.env.corsUrls !== []) {
	corsOptions.origin = process.env.corsUrls.split(',');
	corsOptionsSockets = {
		cors: {
			origin: process.env.corsUrls.split(','),
			methods: ['GET', 'POST']
		}
	};

	console.debug('Using cors.');
	console.debug(corsOptions);
	console.debug(corsOptionsSockets);

	app.use(cors(corsOptions));
}

app.use(express.json());
app.use(boolParser());


/**
 * API routes
 */
app.use('/api/examples', example);

// room routing
app.use('/api/room', room);

// message routing
app.use('/api/message', message);

// utils routing
app.use('/api/utils', utils);

// utils user
app.use('/api/user', user);

app.get('/', (req, res) => {
	res.json({ res: 'Hello World!' });
});



/**
 * Sockets
 */
const httpServer = createServer(app);
const io = new Server(httpServer, corsOptionsSockets);

let clientsPerRoom = {};

/**
 * Handle sockets connetions
 */
io.on('connection', (socket) => {
	// send back to the client its id
	const clientId = socket.id;

	/**
	 * Event triggered when a client wants to join a room
	 */
	socket.on('join-room', (message, ack) => {
		// join room
		const room = message.room;

		let can_join_room = true;

		// check if the user can join the room
		if (room in clientsPerRoom && 'map' in clientsPerRoom[room]) {
			if (io.sockets.adapter.rooms.get(room).size >= maxClientsPerRoom) {
				// the room is full!  you cannot join
				console.error('The room is full! You cannot join!');
				can_join_room = false;
				ack(new AckError('join-room', 'E003', 'Full room'));
				socket.disconnect(false);
			} else if (message.username in clientsPerRoom[room].map) {
				// there's already a user with the same name! you cannot join
				console.error('Username already taken! You cannot join!');
				can_join_room = false;
				ack(new AckError('join-room', 'E001', 'Username not available'));
				socket.disconnect(false);
			} else {
				clientsPerRoom[room].map[message.username] = clientId;
				clientsPerRoom[room].invMap[clientId] = message.username;
			}
		}
		else {
			clientsPerRoom[room] = { map: {}, invMap: {} };
			clientsPerRoom[room].map[message.username] = clientId;
			clientsPerRoom[room].invMap[clientId] = message.username;
		}

		if (can_join_room) {
			socket.join(room);
			console.log('Joined: ' + message.room);
			console.debug('username:' + message.username);

			// emit active users list
			const activeUsers = Object.keys(clientsPerRoom[room].map);
			io.to(room).emit('active-users', activeUsers);
			// use socket to exclude the sender
			socket.to(room).emit('user-action', { username: message.username, action: 'join-room' });
			// send back an ack
			ack(new AckSuccess('join-room'));
		}

	});

	/**
	 * Event triggered on new chat messages
	 */
	socket.on('new-message', (message, ack) => {
		// trying to send message in not existing room
		if (!(message.room in clientsPerRoom)) {
			console.error('Client tried to send message to not existing room');
			socket.disconnect(true);
		}
		// check if user is trying to send messages in a room in which he's not
		else if (!(clientId in clientsPerRoom[message.room].invMap)) {
			console.error('Client is trying to send message in a room in which he\'s not present');
			socket.disconnect(true);
		}
		// check if user is trying to send messages with another username
		else if (message.username != clientsPerRoom[message.room].invMap[clientId]) {
			console.error('Client tried to impersonate another user');
			socket.disconnect(true);
		}
		else {

			// TODO: a new socket event should be defined to keep track of the messages statuses.
			// For example we could send 'pending', 'error', 'sent', and the corresponsing message ids, since we cannot
			// send multiple ack messages.

			// save message to db
			db.rooms.findOne({ name: message.room })
				.then(data => {
					if (!data) {
						console.error('Cannot find the room of the message');
						ack(new AckError('new-message', 'E002', 'Error saving message to DB', message));
					}
					else {
						message._id = new mongoose.Types.ObjectId();
						// add date to message
						message.sentDate = new Date();
						const newMessage = new db.messages(message);
						newMessage.save().then((data) => {

							if (data) {
								// broadcast message to all clients in the room but the sender
								socket.to(message.room).emit('new-message', message);
								ack(new AckSuccess('new-message', message));
							}
						}).catch(() => {
							console.error('Cannot save message (catch)');
							ack(new AckError('new-message', 'E002', 'Error saving message to DB', message));
						});
					}
				})
				.catch(() => {
					console.error('Cannot find the room of the message (catch)');
					ack(new AckError('new-message', 'E002', 'Error saving message to DB', message));
				});
		}
	});

	/**
	 * Event triggered on new sticky messages
	 */
	socket.on('new-sticky-message', (message, ack) => {
		// trying to send message in not existing room
		if (!(message.room in clientsPerRoom)) {
			console.error('Client tried to send sticky message to not existing room');
			socket.disconnect(true);
		}
		// check if user is trying to send messages in a room in which he's not
		else if (!(clientId in clientsPerRoom[message.room].invMap)) {
			console.error('Client is trying to send sticky message in a room in which he\'s not present');
			socket.disconnect(true);
		}
		else {
			// save sticky message to db
			db.rooms.findOne({ name: message.room })
				.then(data => {
					if (!data) {
						console.error('Cannot find the room of the sticky message');
						ack(new AckError('new-sticky-message', 'E002', 'Error saving message to DB', message));
					}
					else {
						if (!data.stickyMessages.includes(message._id)) {
							// add the new sticky message to the array and save the new array
							data.stickyMessages.push(message._id);
							data.save().then((data) => {
								if (data) {
									// broadcast message to all clients in the room but the sender
									socket.to(message.room).emit('new-sticky-message', message);
									ack(new AckSuccess('new-sticky-message', message));
								}
							}).catch(() => {
								console.error('Cannot save sticky message (catch)');
								ack(new AckError('new-sticky-message', 'E002', 'Error saving sticky message to DB', message));
							});
						}
						else {
							console.log('sticky message already exists');
						}
					}
				})
				.catch(() => {
					console.error('Cannot find the room of the sticky message (catch)');
					ack(new AckError('new-sticky-message', 'E002', 'Error saving message to DB', message));
				});
		}
	});
	/**
	 * Event triggered on remove sticky messages
	 */
	socket.on('remove-sticky-message', (message, ack) => {
		// trying to remove sticky message in not existing room
		if (!(message.room in clientsPerRoom)) {
			console.error('Client tried to remove sticky message to not existing room');
			socket.disconnect(true);
		}
		// check if user is trying to remove sticky messages in a room in which he's not
		else if (!(clientId in clientsPerRoom[message.room].invMap)) {
			console.error('Client is trying to remove sticky message in a room in which he\'s not present');
			socket.disconnect(true);
		}
		else {
			// remove sticky message to db
			db.rooms.findOne({ name: message.room })
				.then(data => {
					if (!data) {
						console.error('Cannot find the room of the sticky message');
						ack(new AckError('remove-sticky-message', 'E002', 'Error saving message to DB', message));
					}
					else {

						if (data.stickyMessages.find(msg => msg.toString() === message._id)) {
							// remove sticky message and save the new array
							data.stickyMessages = data.stickyMessages.filter(msg => msg.toString() !== message._id);
							data.save().then((data) => {
								if (data) {
									// broadcast message to all clients in the room but the sender
									socket.to(message.room).emit('remove-sticky-message', message);
									ack(new AckSuccess('remove-sticky-message', message));
								}
							}).catch(() => {
								console.error('Cannot remove sticky message (catch)');
								ack(new AckError('remove-sticky-message', 'E002', 'Error removing sticky message to DB', message));
							});
						}
					}
				})
				.catch(() => {
					console.error('Cannot find the room of the sticky message (catch)');
					ack(new AckError('remove-sticky-message', 'E002', 'Error removing message to DB', message));
				});
		}
	});
	/**
	 * Event triggered when a user is kicked from a room
	 */
	socket.on('kick-user', (kick, ack) => {
		const kickedClientId = clientsPerRoom[kick.room].map[kick.username];
		// check if kicked user exists in the room
		if (typeof kickedClientId !== 'undefined') {
			const kickerUsername = clientsPerRoom[kick.room].invMap[socket.id];
			const userAction = { username: kickerUsername, kickedUsername: kick.username, action: 'kick-user' };
			// notify roommates use socket to exclude the sender
			socket.to(kick.room).emit('user-action', userAction);
			// kick user
			io.to(kickedClientId).emit('kick-user', kickerUsername);
			ack(new AckSuccess('kick-user'));
		} else {
			console.error(`Cannot find the user to kick: ${kick.username}`);
			ack(new AckError('kick-user', 'E004', 'Error kicking user'));
		}
	});


	/**
	 * Event triggered when a client disconnects
	 */
	socket.on('disconnect', () => {

	});

	/**
	 * Event triggered upon disconnecting
	 */
	socket.on('disconnecting', () => {
		const disconnectInfo = Array.from(socket.rooms);
		const room = disconnectInfo[1];
		console.debug('Disconnecting from: ' + room);

		if (room) {
			const nClients = io.sockets.adapter.rooms.get(room).size - 1;

			const clientId = disconnectInfo[0];
			const username = clientsPerRoom[room].invMap[clientId];

			delete clientsPerRoom[room].invMap[clientId];
			delete clientsPerRoom[room].map[username];

			if (nClients > 0) {
				// emit active users list
				const activeUsers = Object.keys(clientsPerRoom[room].map);
				io.to(room).emit('active-users', activeUsers);
				io.to(room).emit('user-action', { username, action: 'leave-room' });
			} else {
				console.debug('No clients in the room!');
				// delete room from active rooms
				delete clientsPerRoom[room];
				// delete room if not persistent
				db.rooms.findOne({ name: room })
					.then(data => {
						if (!data) {
							console.error('Cannot find the room of the message (disconnect)');
						}
						else if (!data.persistent) {
							// if data is not persistent, delete room and its messages
							console.debug(`Delete room ${room} with id ${data._id}`);
							db.rooms.findByIdAndRemove(data._id, { useFindAndModify: false })
								.then(data => {
									if (!data) {
										console.error(`Cannot delete Room with id '${data._id}'. Room not found.`);
									} else {
										console.log('Room was deleted successfully.');
									}
								})
								.catch(() => {
									console.error(`Could not delete Room with id '${data._id}'.`);
								});
							console.debug(`Delete messages of room with name ${data.name}`);
							db.messages.deleteMany({ room: data.name }).then(res => {
								if (res.ok) {
									console.debug(`Found ${res.n} messages`);
									console.debug(`Deleted ${res.deletedCount} messages`);
									console.log('Messages deleted successfully');
								} else {
									console.error(`Could not delete messages for room ${room.name}`);
								}
							}).catch(() => {
								console.error(`Could not delete messages for room ${room.name}`);
							});
						}
					})
					.catch(() => {
						console.error('Cannot find the room of the message (catch disconnect)');
					});
			}
		}
		else {
			console.debug('Disconnecting from undefined room.');
		}
	});

});



httpServer.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});

export default app; // for testing
