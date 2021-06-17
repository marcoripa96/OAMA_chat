import db from '../models/index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const args = process.argv.slice(2);

// number of rooms
let n = 100;

// if n is specified replace
if (args && args.length > 0) {
	if (args[0] === '-n') {
		n = parseInt(args[1]) > 0 ? args[1] : 100;
	} else {
		console.log(`Invalid argument '${args[0]}'`);
		process.exit();
	}
}

let mongoUrl;
if (args.includes('--dev')) {
	mongoUrl = process.env.mongoUrlDev;
} else if(args.includes('--test')) {
	mongoUrl = process.env.mongoUrlTest;
}


const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a nisi vitae felis luctus eleifend. Aenean iaculis sagittis ligula maximus volutpat. Nullam ac mi lobortis, faucibus mi vitae, faucibus elit. Etiam aliquet sem vitae ligula posuere fermentum. Donec egestas purus ac sem accumsan maximus. Aliquam tempus urna nec felis efficitur pharetra. Maecenas id enim ac ligula finibus finibus. Mauris facilisis mauris at urna vehicula sodales. Nulla ultricies velit in ultricies egestas. Aliquam id quam nunc. \
Integer tincidunt auctor ligula ut pellentesque. Curabitur maximus facilisis suscipit. Suspendisse ac lacinia odio. Sed vitae egestas leo, eu condimentum ex. Pellentesque dictum eu nisl eu pretium. Vivamus sed erat ipsum. Fusce faucibus nunc ut erat consectetur faucibus. Proin congue eleifend enim, ac vehicula justo iaculis placerat. Mauris sed sodales neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at ligula non sapien cursus dapibus eu vehicula erat. Proin est ante, semper vel risus ac, tempor dictum nisl. Cras pharetra faucibus erat eu posuere. Suspendisse nisi mi, tempus mattis ex vitae, facilisis elementum nisi.\
Nullam dictum, est vel sagittis vestibulum, dolor arcu pulvinar arcu, nec viverra turpis dolor sit amet sapien. Mauris non arcu gravida, pretium leo sit amet, pulvinar dui. Cras convallis aliquam ornare. Sed sed dolor venenatis, viverra lorem quis, facilisis quam. Donec tempus ligula vitae massa tempor, et rhoncus orci auctor. Proin suscipit odio maximus accumsan aliquam. Morbi quis sem non tellus pulvinar vehicula. Pellentesque quis ex rutrum, tincidunt ligula eget, condimentum nibh.\
Proin lobortis augue a lectus semper dictum. Praesent id dapibus erat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse eros lorem, fringilla vel nisl a, placerat posuere risus. Aliquam iaculis, odio vitae dictum finibus, enim metus sodales dolor, in auctor ex orci in ante. Nam vel facilisis libero, vel volutpat urna. Nunc laoreet mollis lorem non hendrerit. Nulla at ante tortor. Vivamus quis eros eleifend, faucibus erat ac, pharetra dolor. Etiam nec erat et urna sagittis ornare vitae eget nisi. Phasellus luctus ligula eget nisi commodo, id ornare felis finibus. Aliquam risus enim, cursus eu felis in, hendrerit ultricies lorem. Nulla vehicula facilisis mi at aliquam. Fusce risus felis, cursus ut ultrices id, accumsan vel nibh.\
Integer non odio non lectus sodales eleifend. Morbi ac neque et dolor luctus vehicula sit amet quis tortor. Maecenas lorem neque, interdum vitae neque a, consectetur vestibulum justo. Suspendisse nunc velit, mollis sit amet elit vel, dignissim mollis leo. Donec varius, leo eu ornare ultricies, quam enim euismod elit, in aliquet arcu leo accumsan libero. Quisque a neque in quam cursus placerat. Nam mi enim, tincidunt eget fermentum sed, tempor vel ex. Nam suscipit erat turpis, accumsan ornare purus egestas nec. Suspendisse neque elit, sagittis a risus non, posuere viverra dui. Ut ante erat, faucibus eu placerat non, interdum sed sem. Vivamus euismod ligula nulla, ac rutrum orci gravida ut. Sed non aliquet arcu. Fusce volutpat turpis ipsum, sed tristique enim varius quis. Aenean id tristique leo. Mauris sed lacus non mauris fringilla sodales vel at sem. Proin eu hendrerit lectus.\
Proin ipsum nunc, viverra eu nisl ac, fringilla varius nisi. Cras sagittis imperdiet tellus quis eleifend. Ut imperdiet vulputate sem, ut fermentum dui pretium congue. Fusce semper id ex ut suscipit. Aliquam ac tempus arcu. Sed pretium ligula maximus neque dictum iaculis. Phasellus mollis, nulla consectetur consequat maximus, dolor nunc lacinia nibh, in posuere augue ante nec mi. Curabitur fringilla dictum dui, sit amet gravida justo aliquet eu. Praesent elit metus, cursus eget eleifend ac, venenatis nec dui. Nam tempus bibendum ornare. Suspendisse id auctor urna. Nullam dignissim rhoncus volutpat. Duis sed orci sapien.\
Fusce a nulla imperdiet, mollis magna id, volutpat enim. Phasellus porta nunc eu nisl laoreet luctus. Mauris eu dui tincidunt, mattis risus at, consequat diam. Sed eget purus dapibus, sagittis augue quis, molestie eros. Etiam dictum dui id ullamcorper viverra. Phasellus tincidunt gravida lacus ut luctus. Fusce scelerisque quam sed efficitur auctor. Mauris cursus laoreet sem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla euismod nibh massa, vel interdum neque pulvinar sit amet. Etiam in eros sapien. Donec a ultricies libero. Etiam interdum gravida euismod. Maecenas fringilla dictum pharetra. Quisque lacus elit, lobortis eget tortor quis, faucibus fringilla massa. Donec feugiat lacus eros, a rutrum urna sollicitudin id.';


mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log(`Connected to the database! - [${mongoUrl}]\n`);
		createRooms(n);
	})
	.catch(err => {
		console.error(`Cannot connect to the database! - [${mongoUrl}]`, err);
		process.exit();
	});


/**
 * Function which creates 'n' rooms
 */
async function createRooms(n) {
	for (let i = 0; i < n; i++) {
		const room = getRoom(i);
		await room.save();
	}
	console.log(`******** ${n} ROOMS CREATED ********'`);
	process.exit();
}

/**
 * Get a room object
 */
function getRoom(index) {
	const randomStart = Math.random() * (text.length - 0) + 0;

	const createdOn = new Date();
	createdOn.setDate(createdOn.getDate() + 1);

	return new db.rooms({
		name: 'Room number ' + (index + 1),
		private: false,
		persistent: true,
		description: text.substr(randomStart, 90),
		createdOn: createdOn
	});
}
