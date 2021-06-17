import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Index', () => {
	// test GET route '/'
	it('it should GET hello world', (done) => {

		const response = {res: 'Hello World!'};

		chai.request(app).get('/').end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.deep.equal(response);
			done();
		});
	});

});