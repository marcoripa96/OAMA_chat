import autoBind from 'auto-bind';
import db from '../models/index.js';

/**
 * Controller for messages routings
 */
class MessageController {

	constructor() {
		this.roomModel = db.rooms;
		this.messageModel = db.messages;
		autoBind(this);
	}

	/**
	  * Create a new message
	  */
	async create(req, res) {
		// Validate request
		if (!req.body) {
			res.status(400).json({ message: 'Content cannot be empty.' });
			return;
		}

		await this.roomModel.findOne({ name: req.body.room })
			.catch(() => {
				res.status(404).json({ message: 'Room not found' });
			});

		const requestBody = req.body;
		requestBody.sentDate = new Date();

		// Create a Message
		const message = new this.messageModel(requestBody);

		// Save Message in the database
		message.save(message).then(data => {
			res.status(201).json({ message: 'Message created.', data: [data] });
		}).catch(err => {
			res.status(500).json({
				message: err.message || 'Some error occurred while creating the Message.'
			});
		});
	}

	/**
	* Get a message
	*/
	findOne(req, res) {
		const id = req.params.id;

		this.messageModel.findById(id)
			.then(data => {
				if (!data)
					res.status(404).json({ message: 'Message not found.' });
				else res.status(200).json({ data: [data] });
			})
			.catch(() => {
				res.status(500).json({ message: 'Error retrieving a message.' });
			});
	}

	/**
	* Get all messages (can also find by content with filters)
	*/
	find(req, res) {
		// if no query params find all
		if (Object.keys(req.query).length === 0) {
			this.messageModel.find({})
				.then(data => {
					res.status(200).json({ data });
				})
				.catch(err => {
					res.status(500).json({
						message: err.message || 'Some error occurred while retrieving messages.'
					});
				});
		}

		const room = req.query.roomId;
		const content = req.query.content;
		let filter = req.query.filter;

		if (room) {

			if (!content && !filter) {
				// find all messages of a room
				this.messageModel.find({ room: room })
					.then(data => {
						res.status(200).json({ data });
					})
					.catch(err => {
						res.status(500).json({
							message: err.message || 'Some error occurred while retrieving messages.'
						});
					});
			} else {
				// if there is a filter but not content respond with error
				if (filter && !content) {
					res.status(400).json({
						message: 'A filter can be specified only with content.'
					});
				}

				// if content find by content
				if (content) {

					// default to filter 'all'
					let matchMessage = {};
					matchMessage = {
						$match: {
							$or: [
								{ 'content': { $regex: content, $options: 'i' } },
								{ 'firstLinkPreview.title': { $regex: content, $options: 'i' } },
								{ 'firstLinkPreview.description': { $regex: content, $options: 'i' } }
							]
						}
					};

					if (filter === 'link') {
						// search only in links metadata
						matchMessage['$match']['$or'].shift();
					} else if (filter === 'spoiler') {
						// like All filter, but return only spoilers
						const $or = matchMessage['$match'];
						matchMessage = {
							$match: {
								$and: [
									$or,
									{ 'spoiler': true }
								]
							}
						};
					}

					// find by aggregation
					this.messageModel.aggregate(
						[
							// Search messages in a room
							{ $match: { room: room } },
							// Search with regex the content of messages (LIKE query in SQL)
							matchMessage
						]
					).then(data => {
						res.status(200).json({ data });
					}).catch(() => {
						res.status(500).json({ message: 'Error retrieving messages.' });
					});
				}

			}
		}


	}

	/**
	* Update an existing message
	*/
	update(req, res) {
		if (!req.body) {
			return res.status(400).json({
				message: 'Data to update cannot be empty.'
			});
		}

		const id = req.params.id;

		this.messageModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
			.then(data => {
				if (!data) {
					res.status(404).json({
						message: `Could not update Message with id '${id}'. Message not found.`
					});
				} else res.status(200).json({ message: 'Message was updated successfully.', data: [data] });
			})
			.catch(() => {
				res.status(500).json({
					message: `Error updating Message with id '${id}'.`
				});
			});
	}

	/**
 	* Delete a message
 	*/
	delete(req, res) {
		const id = req.params.id;

		this.messageModel.findByIdAndRemove(id, { useFindAndModify: false })
			.then(data => {
				if (!data) {
					res.status(404).json({
						message: `Cannot delete Message with id '${id}'. Message not found.`
					});
				} else {
					res.status(200).json({
						message: 'Message was deleted successfully.'
					});
				}
			})
			.catch(() => {
				res.status(500).json({
					message: 'Could not delete Message.'
				});
			});
	}
}

export default MessageController;