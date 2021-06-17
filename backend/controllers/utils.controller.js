import autoBind from 'auto-bind';
import metascraper from 'metascraper';
import url from 'metascraper-url';
import title from 'metascraper-title';
import description from 'metascraper-description';
import image from 'metascraper-image';
import got from 'got';
/**
 * Controller for room routings
 */
class UtilsController {

	constructor() {
		// metascraper configuration
		this.metascraper = metascraper([
			url(),
			title(),
			description(),
			image()
		]);
		autoBind(this);
	}


	/**
	 * Get link preview
	 */
	getLinkPreview(req, res) {
		const targetUrl = req.query.targetUrl;
		// get page content
		got(targetUrl)
			.then(({ body: html, url }) => {
				// get metadata
				this.metascraper({ html, url })
					.then((data) => {
						res.status(200).json({data});
					})
					.catch(err => {
						res.status(500).json({
							message: `[ERR: ${err.message}]Some error occurred while scraping metadata from ${targetUrl}.`
						});
					});

			})
			.catch(err => {
				res.status(500).json({
					message: `[ERR: ${err.message}] ${targetUrl} cannot be solved to any existing url.`
				});
			});
	}


}

export default UtilsController;