import { describe, it, beforeEach } from 'mocha';
import db from '../models/index.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';


chai.should();

chai.use(chaiHttp);


// parent test block
describe('Examples', () => {
	beforeEach((done) => { //Before each test we empty the database
		const Example = db.examples;

		Example.deleteMany({}, () => {
			done();
		});
	});


	// it should create a new example
	describe('/POST example', () => {
		it('it should create a new example', (done) => {
			const example = {
				title: 'a title',
				description: 'a description'
			};
			chai.request(app)
				.post('/api/examples')
				.send(example)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title').equal(example.title);
					done();
				});
		});

	});

});