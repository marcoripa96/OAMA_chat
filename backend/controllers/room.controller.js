import autoBind from 'auto-bind';
import db from '../models/index.js';
import { randomBytes, pbkdf2Sync } from 'crypto';

/**
 * Controller for room routings
 */
class RoomController {

	constructor() {
		this.model = db.rooms;
		autoBind(this);
	}

	/**
	 * Access to a room
	 */
	async access(req, res) {
		if (!req.body) {
			res.status(400).json({ message: 'Content cannot be empty.' });
			return;
		}

		const name = req.body.name;
		const password = req.body.password;

		// check if room exists
		const existingRoom = await this.model.findOne({ name });

		if (!existingRoom) {
			return res.status(404).json({ message: 'Room ' + name + ' not found.' });
		}

		// if room is private validate password
		if (existingRoom.private) {
			if (this._validPassword(password, existingRoom)) {
				return res.status(200).json({ message: 'Authentication succeded' });
			} else {
				return res.status(401).json({ message: 'Access forbidden' });
			}
		}

		return res.status(200).json({ message: 'Authentication succeded' });
	}

	/**
	 * Create a new room if it doesn't exist
	 */
	async create(req, res) {
		// Validate request
		if (!req.body) {
			res.status(400).json({ message: 'Content cannot be empty.' });
			return;
		}

		const existingRoom = await this.model.findOne({ name: req.body.name })
			.catch(() => {
				res.status(400).json({ message: 'Bad request.' });
			});



		if (existingRoom) {
			return res.status(409).send({ message: `Room '${req.body.name}' already exists.` });
		}

		// Create a Room
		const room = new this.model(this._getRoom(req.body));

		// Save Room in the database
		room
			.save(room)
			.then(data => {
				const room = data.toObject();
				delete room.salt;
				delete room.hash;
				res.status(201).json({ message: 'Room created.', data: [room] });
			})
			.catch(err => {
				res.status(500).json({
					message: err.message || 'Some error occurred while creating the Room.'
				});
			});
	}

	/**
	  * Get a room by its name
	  */
	findOne(req, res) {

		const name = req.params.name;

		this.model.findOne({ name: name })
			.populate('stickyMessages')
			.then(data => {
				if (!data)
					res.status(404).json({ message: 'Room ' + name + ' not found.' });
				else res.status(200).json({ data: [data] });
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({ message: 'Error retrieving Example with name \'' + name + '\'.' });
			});
	}

	/**
	 * Get rooms by query or parameters and with pagination
	 */

	async find(req, res) {
		// if no parameters return all rooms
		if (Object.keys(req.query).length === 0) {
			this.model.find({})
				.populate('stickyMessages')
				.then(data => {
					res.status(200).json({ data });
				})
				.catch(() => {
					res.status(500).json({
						message: 'Some error occurred while retrieving rooms.'
					});
				});
		} else {
			// filter out undesired fields
			const queryParams = Object.assign({}, ...['resultsPerPage', 'page', 'persistent', 'private', 'query'].map(key => ({ [key]: req.query[key] })));

			// extract parameters relative to pagination
			const resultsPerPage = queryParams.resultsPerPage > 0 ? parseInt(queryParams.resultsPerPage) : 20;
			const page = queryParams.page > -1 ? parseInt(queryParams.page) : 0;
			delete queryParams.resultsPerPage;
			delete queryParams.page;

			// extract query parameters
			const query = queryParams.query ? queryParams.query : '';
			delete queryParams.query;

			// remove private or persistent if they are undefined
			if (!queryParams.private) {
				delete queryParams.private;
			}
			if (!queryParams.persistent) {
				delete queryParams.persistent;
			}

			// define match query
			let matchQuery = [
				{ $match: queryParams },
				{ $sort: { createdOn: -1 } },
				{ $skip: resultsPerPage * page },
				{ $limit: resultsPerPage }
			];

			// if a query is present retrieve rooms with query in names or description
			if (query) {
				const queryLike = {
					$match: {
						$or: [
							{ 'name': { $regex: query, $options: 'i' } },
							{ 'description': { $regex: query, $options: 'i' } },
						]
					}
				};
				// add regex match in filters
				matchQuery.splice(1, 0, queryLike);
			}

			// count total document for a query so client knows if there are more pages
			const numberOfDocuments = await this.model.countDocuments({
				$and: [
					queryParams,
					{
						$or: [
							{ 'name': { $regex: query, $options: 'i' } },
							{ 'description': { $regex: query, $options: 'i' } },
						]
					}
				]
			});
			// check if there are more pages
			const moreDocuments = resultsPerPage + resultsPerPage * page >= numberOfDocuments ? false : true;

			// find by aggregation so we can also search
			this.model.aggregate([matchQuery]).then(data => {
				res.status(200).json({ more: moreDocuments, data });
			}).catch(() => {
				res.status(500).json({ message: 'Error retrieving rooms.' });
			});

		}
	}

	/**
	 * Update an existing room
	 */
	update(req, res) {
		if (!req.body) {
			return res.status(400).json({
				message: 'Data to update cannot be empty.'
			});
		}

		const id = req.params.id;


		this.model.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
			.then(data => {
				if (!data) {
					res.status(404).json({
						message: `Could not update Room with id '${id}'. Room not found.`
					});
				} else res.status(200).json({ message: 'Room was updated successfully.', data: [data] });
			})
			.catch(() => {
				res.status(500).json({
					message: `Error updating Room with id '${id}'.`
				});
			});
	}

	/**
	 * Delete a room
	 */
	delete(req, res) {
		const id = req.params.id;

		this.model.findByIdAndRemove(id, { useFindAndModify: false })
			.then(data => {
				if (!data) {
					res.status(404).json({
						message: `Cannot delete Room with id '${id}'. Room not found.`
					});
				} else {
					res.status(200).json({
						message: 'Room was deleted successfully.'
					});
				}
			})
			.catch(() => {
				res.status(500).json({
					message: `Could not delete Room with id '${id}'.`
				});
			});
	}

	// validate password
	_validPassword(password, room) {
		const salt = Buffer.from(room.salt, 'base64');
		const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('base64');
		return room.hash === hash;
	}
	// encrypt password
	_encrypt(password) {
		let salt = randomBytes(32);
		const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('base64');
		salt = salt.toString('base64');
		return [salt, hash];
	}

	_getRoom(fields) {
		const room = fields;
		if (room.private) {
			const hashes = this._encrypt(room.password);
			room.salt = hashes[0];
			room.hash = hashes[1];
			delete room.password;
		}
		return room;
	}

}

export default RoomController;