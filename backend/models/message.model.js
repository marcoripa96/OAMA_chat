import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	room: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	spoiler: {
		type: Boolean,
		required: true
	},
	spoilerTopic: {
		type: String,
		required: false
	},
	sentDate: {
		type: Date,
		required: false
	},
	firstLinkPreview: {
		url: {
			type: String
		},
		title: {
			type: String
		},
		description: {
			type: String
		},
		image: {
			type: String
		}
	}
});

export default mongoose.model('Message', messageSchema);