import { describe, it, after } from 'mocha';
import db from '../models/index.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import UserController from '../controllers/user.controller.js';


chai.should();

chai.use(chaiHttp);


describe('Users', () => {

	let User = db.users;

	const user = {
		email: 'example@example.com',
		name: 'Example Example',
		password: '4b01c2abcf8898b4efe43fa38f8cbbe50b38ecc652889287845b572b91e88a2a',
		date: new Date()
	};

	// not exists
	it('should understand user does not exist', (done) => {
		const email = user.email;

		chai.request(app)
			.post('/api/user/exists')
			.send({ email: email })
			.end((err, res) => {
				res.should.have.status(404);
				done();
			});
	});

	// create
	it('should create a new user', (done) => {
		chai.request(app)
			.post('/api/user')
			.send(user)
			.end((err, res) => {
				res.should.have.status(201);
				done();
			});
	});

	// exists
	it('should understand user exists', (done) => {
		const email = user.email;

		chai.request(app)
			.post('/api/user/exists')
			.send({ email: email })
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});

	// verify email
	it('should verify email', (done) => {

		const uc = new UserController();

		// manually create a user with email not verified
		const emailToken = uc._getEmailToken();
		const emailTokenHash = uc._encrypt(emailToken, '')[1];

		const password = '5aee692b2c7814726eb2976ca7091299540f01233f840108a53b1b336d414b82';
		const [passwordSalt, passwordHash] = uc._encrypt(password);

		const user = {
			emailIsVerified: false,
			requirePasswordChange: false,
			email: 'verify@me.com',
			name: 'Verify Verify',
			date: new Date(),
			passwordSalt: passwordSalt,
			passwordHash: passwordHash,
			emailTokenHash: emailTokenHash
		};

		const dbUser = new User(user);
		dbUser
			.save(dbUser)
			.then(() => {
				chai.request(app)
					.post('/api/user/verifyEmail')
					.send({ emailToken: emailToken })
					.end((err, res) => {
						res.should.have.status(200);
						done();
					});
			});
	});

	after((done) => {
		User.deleteMany({}, () => {
			done();
		});
	});

});