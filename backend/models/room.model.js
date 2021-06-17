import mongoose from 'mongoose';
//import Message from './message.model.js';
const Schema = mongoose.Schema;

const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	hash: {
		type: String
	},
	salt: {
		type: String
	},
	private: {
		type: Boolean,
		required: true
	},
	persistent: {
		type: Boolean,
		required: true,
		default: false
	},
	description: {
		type: String
	},
	createdOn: {
		type: Date,
		required: true,
		default: new Date()
	},
	stickyMessages: [{
		type: Schema.Types.ObjectId,
		ref: 'Message'
	}]
});
export default mongoose.model('Room', roomSchema);