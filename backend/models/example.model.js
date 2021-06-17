import mongoose from 'mongoose';
/**
 * Example Model
 */
const exampleSchema = new mongoose.Schema({
	title: String,
	description: String
});

export default mongoose.model('Example', exampleSchema);
