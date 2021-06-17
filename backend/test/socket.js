import { io as Client } from 'socket.io-client';
import { assert } from 'chai';
import chai from 'chai';
import app from '../index.js';
import { describe, it, after } from 'mocha';
import db from '../models/index.js';

// use the default export
const { request } = chai;

function getRandomString(prefix, length) {
	var result = [];
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() *
			charactersLength)));
	}
	return prefix + result.join('');
}

function getSocket(port = 3000) {
	let clientSocket = new Client(`http://localhost:${port}`);
	return clientSocket.connect();
}


describe('socket api tests', () => {
	const Room = db.rooms;
	const Message = db.messages;

	const room0 = getRandomString('test-room0', 10);
	const room1 = getRandomString('test-room1', 10);
	const room2 = getRandomString('test-room2', 10);
	const room3 = getRandomString('test-room3', 10);
	const room4 = getRandomString('test-room4', 10);
	const room5 = getRandomString('test-room5', 10);
	const room6 = getRandomString('test-room6', 10);

	const persistentRoom = getRandomString('test-room-persistent', 10);


	const username0 = getRandomString('test-user0', 10);
	const username1 = getRandomString('test-user1', 10);
	const username2 = getRandomString('test-user2', 10);
	const username3 = getRandomString('test-user3', 10);

	it('should create public room0 for socket tests', (done) => {
		request(app)
			.post('/api/room')
			.send({
				name: room0,
				private: false
			})
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				data.should.have.property('name').equal(room0);
				data.should.not.have.property('salt');
				data.should.not.have.property('hash');
				done();
			});
	});

	it('should create public room1 for socket tests', (done) => {
		request(app)
			.post('/api/room')
			.send({
				name: room1,
				private: false
			})
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				data.should.have.property('name').equal(room1);
				data.should.not.have.property('salt');
				data.should.not.have.property('hash');
				done();
			});
	});

	it('should create public room2 for socket tests', (done) => {
		request(app)
			.post('/api/room')
			.send({
				name: room2,
				private: false
			})
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				data.should.have.property('name').equal(room2);
				data.should.not.have.property('salt');
				data.should.not.have.property('hash');
				done();
			});
	});

	it('should create public room3 for socket tests', (done) => {
		request(app)
			.post('/api/room')
			.send({
				name: room3,
				private: false
			})
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				data.should.have.property('name').equal(room3);
				data.should.not.have.property('salt');
				data.should.not.have.property('hash');
				done();
			});
	});

	it('should create public room4 for socket tests', (done) => {
		request(app)
			.post('/api/room')
			.send({
				name: room4,
				private: false
			})
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				data.should.have.property('name').equal(room4);
				data.should.not.have.property('salt');
				data.should.not.have.property('hash');
				done();
			});
	});

	it('should create public room5 for socket tests', (done) => {
		request(app)
			.post('/api/room')
			.send({
				name: room5,
				private: false
			})
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				data.should.have.property('name').equal(room5);
				data.should.not.have.property('salt');
				data.should.not.have.property('hash');
				done();
			});
	});

	it('should create public room6 for socket tests', (done) => {
		request(app)
			.post('/api/room')
			.send({
				name: room6,
				private: false
			})
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				data.should.have.property('name').equal(room6);
				data.should.not.have.property('salt');
				data.should.not.have.property('hash');
				done();
			});
	});

	it('should create public persistent room for socket tests', (done) => {
		request(app)
			.post('/api/room')
			.send({
				name: persistentRoom,
				private: false,
				persistent: true
			})
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				data.should.have.property('name').equal(persistentRoom);
				data.should.have.property('persistent').equal(true);
				done();
			});
	});

	it('should not sent a message in a different not existing room', (done) => {

		let clientSocket = getSocket();

		const wrongRoom = 'wrong-room';

		let successesCount = 0;

		clientSocket.on('disconnect', () => {
			// should get disconnected after trying to send in wrong room
			successesCount++;
			assert.equal(successesCount, 3);
			done();
			clientSocket.close();
		});

		clientSocket.emit('join-room', {
			room: room0,
			username: username0
		}, (arg) => {
			// should join room successfully

			assert.equal(arg.success, true);
			successesCount++;

			clientSocket.emit('new-message', {
				username: username0,
				room: room0,
				content: 'test message',
				spoiler: false
			}, (arg2) => {
				// should send a message in the correct room
				// with correct username
				assert.equal(arg2.success, true);
				successesCount++;

				clientSocket.emit('new-message', {
					username: username0,
					room: wrongRoom,
					content: 'test message in wrong room',
					spoiler: false
				}, () => {
					// should not send a message in a non existing room
					assert.equal(true, false);
				});
			});
		});
	});

	it('socket should not sent a message in a different existing room', (done) => {
		let clientSocket = getSocket();
		let clientSocket2 = getSocket();

		let successesCount = 0;

		clientSocket.on('disconnect', () => {
			// should get disconnected after trying to send in wrong room
			successesCount++;
			assert.equal(successesCount, 4);
			done();
			clientSocket.close();
			clientSocket2.close();
		});

		clientSocket.emit('join-room', {
			room: room1,
			username: username1
		}, (arg) => {
			// should join room successfully

			assert.equal(arg.success, true);
			successesCount++;

			clientSocket2.emit('join-room', {
				room: room2,
				username: username2
			}, (arg2) => {
				assert.equal(arg2.success, true);
				successesCount++;

				clientSocket.emit('new-message', {
					username: username1,
					room: room1,
					content: 'test message',
					spoiler: false
				}, (arg3) => {
					// should send a message in the correct room
					// with correct username
					assert.equal(arg3.success, true);
					successesCount++;

					clientSocket.emit('new-message', {
						username: username1,
						room: room2,
						content: 'test message in wrong room',
						spoiler: false
					}, () => {
						// should not send a message in a non existing room
						assert.equal(true, false);
					});
				});
			});
		});
	});

	it('should not sent a message in correct room but with another username', (done) => {
		let clientSocket = getSocket();

		let successesCount = 0;

		clientSocket.on('disconnect', () => {
			// should get disconnected after trying to send in wrong room
			successesCount++;
			assert.equal(successesCount, 3);
			done();
			clientSocket.close();
		});

		clientSocket.emit('join-room', {
			room: room3,
			username: username1
		}, (arg) => {
			// should join room successfully

			assert.equal(arg.success, true);
			successesCount++;

			clientSocket.emit('new-message', {
				username: username1,
				room: room3,
				content: 'test message',
				spoiler: false
			}, (arg3) => {
				// should send a message in the correct room
				// with correct username
				assert.equal(arg3.success, true);
				successesCount++;

				clientSocket.emit('new-message', {
					username: username2,
					room: room3,
					content: 'test message as wrong user',
					spoiler: false
				}, () => {
					// should not send a message in a non existing room
					assert.equal(true, false);
				});
			});
		});
	});

	it('socket should not sent a message with the username of another connected user', (done) => {
		let clientSocket = getSocket();
		let clientSocket2 = getSocket();

		let successesCount = 0;

		clientSocket.on('disconnect', () => {
			// should get disconnected after trying to send in wrong room
			successesCount++;
			assert.equal(successesCount, 4);
			done();
			clientSocket.close();
			clientSocket2.close();
		});

		clientSocket.emit('join-room', {
			room: room4,
			username: username1
		}, (arg) => {
			// should join room successfully

			assert.equal(arg.success, true);
			successesCount++;

			clientSocket2.emit('join-room', {
				room: room4,
				username: username2
			}, (arg2) => {
				assert.equal(arg2.success, true);
				successesCount++;

				clientSocket.emit('new-message', {
					username: username1,
					room: room4,
					content: 'test message',
					spoiler: false
				}, (arg3) => {
					// should send a message in the correct room
					// with correct username
					assert.equal(arg3.success, true);
					successesCount++;

					clientSocket.emit('new-message', {
						username: username2,
						room: room4,
						content: 'test message as another connected user',
						spoiler: false
					}, () => {
						// should not send a message in a non existing room
						assert.equal(true, false);
					});
				});
			});
		});
	});

	it('socket should not let a client with not available username join the room', (done) => {
		let clientSocket = getSocket();
		let clientSocket2 = getSocket();
		clientSocket.emit('join-room', {
			room: room5,
			username: username1
		}, (arg) => {
			// should join room successfully
			assert.equal(arg.success, true);
			// try to join with not available username
			clientSocket2.emit('join-room', {
				room: room5,
				username: username1
			}, (arg2) => {
				// should not join the room
				assert.equal(arg2.success, false);
				done();
			});
		});
	});

	it('socket should not let a client join a full room', (done) => {
		let clientSocket = getSocket();
		let clientSocket2 = getSocket();
		let clientSocket3 = getSocket();
		clientSocket.emit('join-room', {
			room: room6,
			username: username1
		}, (arg) => {
			// should join room successfully
			assert.equal(arg.success, true);
			// should join room successfully
			clientSocket2.emit('join-room', {
				room: room6,
				username: username2
			}, (arg2) => {
				// should join room successfully
				assert.equal(arg2.success, true);
				clientSocket3.emit('join-room', {
					room: room6,
					username: username3
				}, (arg3) => {
					// should not join the room
					assert.equal(arg3.success, false);
					done();
					clientSocket.close();
					clientSocket2.close();
					clientSocket3.close();
				});
			});
		});
	});

	it('socket should send active users list to client on join room and on disconnect', (done) => {
		let clientSocket = getSocket();
		let clientSocket2 = getSocket();


		let expectedUsers = [username1];
		let index = 0;

		clientSocket.on('active-users', (res) => {
			res.should.have.length(expectedUsers.length);
			res.should.be.deep.equal(expectedUsers);
			if (index === 0) {
				expectedUsers.push(username2);
				index++;
			} else {
				expectedUsers = expectedUsers.filter(el => el === username1);
			}
		});

		clientSocket.emit('join-room', {
			room: persistentRoom,
			username: username1
		}, (arg) => {
			// should join room successfully
			assert.equal(arg.success, true);

			clientSocket2.emit('join-room', {
				room: persistentRoom,
				username: username2
			}, (arg) => {
				// should join room successfully
				assert.equal(arg.success, true);
				//clientSocket.close();
				clientSocket2.close();
				clientSocket.close();
				done();
			});
		});
	});

	it('socket should send user-action to client on join room', (done) => {
		let clientSocket = getSocket();
		let clientSocket2 = getSocket();

		clientSocket.on('user-action', (res) => {
			assert.equal(res.action, 'join-room');
			clientSocket.close();
			done();
		});

		clientSocket.emit('join-room', {
			room: persistentRoom,
			username: username1
		}, () => {
			clientSocket2.emit('join-room', {
				room: persistentRoom,
				username: username2
			}, () => {
				clientSocket2.close();
			});
		});
	});

	it('socket should send user-action to client on leave room', (done) => {
		let clientSocket = getSocket();
		let clientSocket2 = getSocket();

		clientSocket2.on('user-action', (res) => {
			assert.equal(res.action, 'leave-room');
			clientSocket2.close();
			done();
		});

		clientSocket.emit('join-room', {
			room: persistentRoom,
			username: username1
		}, () => {
			clientSocket2.emit('join-room', {
				room: persistentRoom,
				username: username2
			}, () => {
				clientSocket.close();
			});
		});
	});

	it('socket should send a kick message to the kicked user', (done) => {
		let clientSocket = getSocket();
		let clientSocket2 = getSocket();

		clientSocket.on('kick-user', (res) => {
			assert.equal(res, username2);
			clientSocket.close();
			done();
		});

		clientSocket.emit('join-room', {
			room: persistentRoom,
			username: username1
		}, () => {
			clientSocket2.emit('join-room', {
				room: persistentRoom,
				username: username2
			}, () => {
				clientSocket2.emit('kick-user', {
					username: username1, room: persistentRoom
				}, () => {
					clientSocket2.close();
				});

			});
		});
	});

	after((done) => {
		Room.deleteMany({}, () => {
		});

		Message.deleteMany({}, () => {
		});
		done();
	});
});