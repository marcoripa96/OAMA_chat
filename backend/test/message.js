import chai from 'chai';
import app from '../index.js';
import { describe, it, after } from 'mocha';
import db from '../models/index.js';

// use the default export
const { request } = chai;


chai.should();


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



// parent test block
describe('Messages', () => {

	const Room = db.rooms;
	const Message = db.messages;

	const room0 = getRandomString('test-room0', 10);
	const room1 = getRandomString('test-room1', 10);

	const message0 = {
		room: room0,
		content: 'content test',
		username: 'test',
		spoiler: false
	};

	const message1 = {
		room: room1,
		content: 'content test',
		username: 'test',
		spoiler: false
	};

	const messageWithPreview = {
		room: room0,
		content: 'content test',
		username: 'test',
		spoiler: false,
		firstLinkPreview: {
			url: 'www.test.it',
			title: 'test title previw',
			description: 'a test description'
		}
	};

	let storedMessagesId = [];

	it('should create public room0 for message tests', (done) => {
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

	it('should create public room1 for message tests', (done) => {
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

	it('should create a new message in room0', (done) => {
		request(app)
			.post('/api/message')
			.send(message0)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				storedMessagesId.push({ room: room0, message: message0, id: data._id });
				data.should.have.property('content').equal(message0.content);
				data.should.have.property('sentDate');
				done();
			});
	});

	it('should create a new message in room1', (done) => {
		request(app)
			.post('/api/message')
			.send(message1)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				storedMessagesId.push({ room: room1, message: message1, id: data._id });
				data.should.have.property('content').equal(message1.content);
				done();
			});
	});

	it('should create a new message with preview', (done) => {
		request(app)
			.post('/api/message')
			.send(messageWithPreview)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				storedMessagesId.push({ room: room0, message: messageWithPreview, id: data._id });
				data.should.have.property('content').equal(messageWithPreview.content);
				done();
			});
	});

	it('should get a message', (done) => {
		const item = storedMessagesId[0];

		request(app)
			.get(`/api/message/${item.id}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				data.should.have.property('content').equal(item.message.content);
				done();
			});
	});

	it('should get all messages', (done) => {
		request(app)
			.get('/api/message')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				const data = res.body.data;
				data.should.have.length(3);
				done();
			});
	});

	it('should get all messages from room0', (done) => {
		request(app)
			.get(`/api/message?roomId=${room0}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				const data = res.body.data;
				data.should.have.length(2);
				done();
			});
	});

	it('should get all messages from room0 with content and filter links', (done) => {
		request(app)
			.get(`/api/message?roomId=${room0}&content=description&filter=link`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				const data = res.body.data;

				data.should.have.length(1);
				const firstLinkPreview = data[0].firstLinkPreview;
				firstLinkPreview.should.have.property('description').equal(messageWithPreview.firstLinkPreview.description);
				done();
			});
	});

	it('should update a message by id', (done) => {
		const item = storedMessagesId[0];

		const newMessage = {
			content: 'updated content'
		};

		request(app)
			.put(`/api/message/${item.id}`)
			.send(newMessage)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');

				const data = res.body.data[0];
				data.should.have.property('content').equal(newMessage.content);
				done();
			});
	});

	it('should delete a message by id', (done) => {
		const item = storedMessagesId[0];


		request(app)
			.delete(`/api/message/${item.id}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.should.have.status(200);
				done();
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