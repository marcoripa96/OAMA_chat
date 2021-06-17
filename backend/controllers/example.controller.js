import autoBind from 'auto-bind';
import db from '../models/index.js';

/**
 *  ExampleController
 */

class ExampleController {

	constructor() {
		this.model = db.examples;
		autoBind(this);
	}

	welcome(req, res) {
		// Validate request if needed
		res.send({msg: 'Welcome to OAMA!'});
	}

	// Create and Save a new Example
	create(req, res) {

		// Validate request
		if (!req.body.title || !req.body.description) {
			res.status(400).json({ message: 'Content can not be empty!' });
			return;
		}

		console.log(this.hello);

		// Create a Example
		const example = new this.model({
			title: req.body.title,
			description: req.body.description
		});

		// Save Example in the database
		example
			.save(example)
			.then(data => {
				res.json(data);
			})
			.catch(err => {
				res.status(500).json({
					message:
						err.message || 'Some error occurred while creating the Example.'
				});
			});
	}

	// Retrieve all Examples from the database.
	findAll(req, res) {
		const name = req.query.name;
		var condition = name ? { name: { $regex: new RegExp(name), $options: 'i' } } : {};

		this.model.find(condition)
			.then(data => {
				res.json(data);
			})
			.catch(err => {
				res.status(500).json({
					message:
						err.message || 'Some error occurred while retrieving examples.'
				});
			});
	}

	// Find a single Example with an id
	findOne(req, res) {
		const id = req.params.id;

		this.model.findById(id)
			.then(data => {
				if (!data)
					res.status(404).json({ message: 'Not found Example with id ' + id });
				else res.json(data);
			})
			.catch(() => {
				res
					.status(500)
					.json({ message: 'Error retrieving Example with id=' + id });
			});
	}

	// Update a Example by the id in the request
	update(req, res) {
		if (!req.body) {
			return res.status(400).json({
				message: 'Data to update can not be empty!'
			});
		}

		const id = req.params.id;

		this.model.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
			.then(data => {
				if (!data) {
					res.status(404).json({
						message: `Cannot update Example with id=${id}. Maybe Example was not found!`
					});
				} else res.json({ message: 'Example was updated successfully.' });
			})
			.catch(() => {
				res.status(500).json({
					message: 'Error updating Example with id=' + id
				});
			});
	}

	// // Delete a Example with the specified id in the request
	// exports.delete = (req, res) => {
	//     const id = req.params.id;

	//   Example.findByIdAndRemove(id)
	//     .then(data => {
	//       if (!data) {
	//         res.status(404).json({
	//           message: `Cannot delete Example with id=${id}. Maybe Example was not found!`
	//         });
	//       } else {
	//         res.json({
	//           message: 'Example was deleted successfully!'
	//         });
	//       }
	//     })
	//     .catch(err => {
	//       res.status(500).json({
	//         message: 'Could not delete Example with id=' + id
	//       });
	//     });
	// };
}

export default ExampleController;

