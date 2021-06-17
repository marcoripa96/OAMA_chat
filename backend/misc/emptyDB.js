import db from '../models/index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const args = process.argv.slice(2);

let mongoUrl;
if (args[0] === '--dev') {
	mongoUrl = process.env.mongoUrlDev;
} else if(args[0] === '--test') {
	mongoUrl = process.env.mongoUrlTest;
} else {
	console.error('Invalid argument');
	process.exit();
}

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log(`Connected to the database! - [${mongoUrl}]\n`);
		emptyDB();
	})
	.catch(err => {
		console.error(`Cannot connect to the database! - [${mongoUrl}]`, err);
		process.exit();
	});

async function emptyDB() {
	const resRooms = await db.rooms.deleteMany({});
	printRes('Room', resRooms);
	const resMessages = await db.messages.deleteMany({});
	printRes('Message', resMessages);
	process.exit();
}

function printRes(collection, res) {
	console.log(`******** ${collection} ********`);
	console.log(`Operation: ${res.ok ? 'success' : 'failure'}`);
	console.log(`Found documents: ${res.n}`);
	console.log(`Deleted documents: ${res.deletedCount}\n`);
}