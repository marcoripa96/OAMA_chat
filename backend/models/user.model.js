import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		index: true,
		unique: true
	},
	emailTokenHash: {
		type: String,
		unique: true,
		index: true
	},
	emailIsVerified: {
		type: Boolean,
		required: true,
		default: false
	},
	name: {
		type: String,
		required: true
	},
	passwordHash: {
		type: String,
		required: true
	},
	passwordSalt: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true,
		default: Date.now
	},
	requirePasswordChange: {
		type: Boolean,
		required: true,
		default: false
	}
});

export default mongoose.model('User', userSchema);