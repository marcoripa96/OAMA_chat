import { describe, it, after } from 'mocha';
import db from '../models/index.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';


chai.should();

chai.use(chaiHttp);


describe('Rooms', () => {

	let Room = db.rooms;

	let publicRoom = {
		name: 'roomname',
		private: false
	};

	let privateRoom = {
		name: 'roomname2',
		description: 'testdescription',
		private: true,
		password: 'password'
	};

	it('should create a new public room', (done) => {
		chai.request(app)
			.post('/api/room')
			.send(publicRoom)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				data.should.have.property('name').equal(publicRoom.name);
				data.should.not.have.property('salt');
				data.should.not.have.property('hash');
				done();
			});
	});

	it('should create a new private room', (done) => {
		chai.request(app)
			.post('/api/room')
			.send(privateRoom)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				const data = res.body.data[0];
				data.should.have.property('name').equal(privateRoom.name);
				data.should.have.property('private').equal(privateRoom.private);
				data.should.have.property('description').equal(privateRoom.description);
				done();
			});
	});

	it('should not create a new room if it already exists', (done) => {
		chai.request(app)
			.post('/api/room')
			.send(publicRoom)
			.end((err, res) => {
				res.should.have.status(409);
				done();
			});
	});

	it('should get a room by name', (done) => {
		chai.request(app)
			.get(`/api/room/${publicRoom.name}`)
			.end((err, res) => {
				res.should.have.status(200);
				const data = res.body.data[0];
				data.should.have.property('name').equal(publicRoom.name);
				done();
			});
	});

	it('should return 404 if room doesnt exist', (done) => {

		const doesntExist = 'iDontExist';

		chai.request(app)
			.get(`/api/room/${doesntExist}`)
			.end((err, res) => {
				res.should.have.status(404);
				done();
			});
	});

	it('should get all rooms', () => {
		const secondRoom = new Room({
			name: 'secondroom',
			private: false
		});

		return secondRoom.save(secondRoom).then(() => {
			chai.request(app)
				.get('/api/room')
				.end((err, res) => {
					res.should.have.status(200);
					const data = res.body.data;
					data.should.have.length(3);
				});
		});
	});

	it('should get page 0 of all private rooms', (done) => {
		chai.request(app)
			.get('/api/room?page=0&private=true')
			.end((err, res) => {
				res.should.have.status(200);
				const data = res.body.data;
				data.should.have.length(1);
				done();
			});
	});

	it('should access a public room', (done) => {
		const body = {name: publicRoom.name};

		chai.request(app)
			.post('/api/room/access')
			.send(body)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				const message = res.body.message;
				message.should.equal('Authentication succeded');
				done();
			});
	});

	it('should access a private room if password is correct', (done) => {
		const body = {name: privateRoom.name, password: privateRoom.password };

		chai.request(app)
			.post('/api/room/access')
			.send(body)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				const message = res.body.message;
				message.should.equal('Authentication succeded');
				done();
			});
	});

	it('should not access a private room if password is incorrect', (done) => {
		const body = {name: privateRoom.name, password: 'wrongPassword' };

		chai.request(app)
			.post('/api/room/access')
			.send(body)
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.a('object');
				const message = res.body.message;
				message.should.equal('Access forbidden');
				done();
			});
	});


	it('should update a room by id', () => {
		return Room.findOne({ name: 'secondroom' }).then(roomFound => {
			const newRoom = {
				name: 'newroom'
			};

			chai.request(app)
				.put(`/api/room/${roomFound._id}`)
				.send(newRoom)
				.end((err, res) => {
					res.should.have.status(200);
					const data = res.body.data[0];
					data.should.have.property('name').equal(newRoom.name);
				});
		});
	});

	it('should delete a room by id', () => {
		return Room.findOne({ name: publicRoom.name }).then(roomFound => {
			chai.request(app)
				.delete(`/api/room/${roomFound._id}`)
				.end((err, res) => {
					res.should.have.status(200);
				});
		});
	});



	after((done) => {
		Room.deleteMany({}, () => {
			done();
		});
	});

});