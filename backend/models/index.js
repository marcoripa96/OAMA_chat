import Example from './example.model.js';
import Room from './room.model.js';
import Message from './message.model.js';
import User from './user.model.js';

const db = {};

// collections definition
db.examples = Example;
db.rooms = Room;
db.messages = Message;
db.users = User;


export default db;