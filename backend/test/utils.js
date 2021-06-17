import { describe, it } from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';


chai.should();

chai.use(chaiHttp);


describe('Link previews', () => {
	it('should get url metadata with getLinkPreview', (done) => {
		const targetUrl = 'https://www.youtube.com';
		chai.request(app)
			.get(`/api/utils/getLinkPreview?targetUrl=${targetUrl}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				const data = res.body.data;
				data.should.have.property('url').equal(targetUrl);
				data.should.have.property('title');
				data.should.have.property('description');
				data.should.have.property('image');
				done();
			});
	});
});