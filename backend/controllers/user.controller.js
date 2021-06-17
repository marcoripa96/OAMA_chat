import autoBind from 'auto-bind';
import db from '../models/index.js';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { transporter, senderAddress, logInfo } from '../config/mail-config.js';
import mongoose from 'mongoose';

class UserController {
	constructor() {
		this.model = db.users;
		autoBind(this);
	}

	/**
	 * Creates a random email token so that it is unique in the db
	 */
	_getEmailToken() {
		mongoose.Types.ObjectId().toString('base64');
		return Buffer.concat(
			[
				// unique identifier from db
				Buffer.from(mongoose.Types.ObjectId().toString(), 'hex'),
				// random
				randomBytes(64)
			]).toString('base64');
	}

	/**
	 * Gets user fields
	*/
	_getUser(fields) {
		const user = fields;
		return user;
	}

	// encrypt password
	_encrypt(password, salt = null) {
		if (salt == null) {
			salt = randomBytes(32);
		} else {
			salt = Buffer.from(salt, 'base64');
		}
		const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('base64');

		salt = salt.toString('base64');

		return [salt, hash];
	}

	/**
	 * Check if user already exists by email
	 */
	async exists(req, res) {
		const email = req.body.email;

		this.model.exists({ email: email })
			.then(data => {
				if (!data)
					res.status(404).json({ message: '404 Not Found.', status: 404 });
				else res.status(200).json({ message: '200 Found.', status: 200 });
			})
			.catch(() => {
				res.status(500).json({ message: 'Error retrieving User with email \'' + email + '\'.' });
			});
	}

	/**
	 * Verify User email given registration token sent via email
	 * POST
	 */
	async verifyEmailPost(req, res) {
		let emailToken;
		if ('emailToken' in req.body) {
			emailToken = req.body.emailToken;
		}
		if (!emailToken) {
			res.status(500).json({
				message: 'emailToken is required!.'
			});
			return;
		}

		const emailTokenHash = this._encrypt(emailToken, '')[1];

		this.model.findOne({
			emailTokenHash: emailTokenHash
		})
			.then(user => {
				if (!user) {
					res.status(404).json({ message: '404 User Not Found.', status: 404 });
				}
				else {
					if (user.emailIsVerified) {
						res.status(201).json({ message: 'Email already verified.', status: 201 });
					}
					else {
						user.emailIsVerified = true;
						user.save()
							.then(() => res.status(200).json({ message: 'Email verified.', status: 200 }))
							.catch(err => {
								res.status(500).json({
									message: err.message || 'Some error occurred while saving to database.'
								});
							});
					}
				}
			})
			.catch(err => {
				res.status(500).json({
					message: err.message || 'Some error occurred while accessing the database.'
				});
			});

	}

	/**
	 * Create a new user if it doesn't exist
	 */
	async create(req, res) {
		// Validate request
		if (!req.body) {
			res.status(400).json({ message: 'Content cannot be empty.' });
			return;
		}

		const existingUser = await this.model.exists({ email: req.body.email })
			.catch(err => {
				res.status(500).json({
					message: err.message || 'Some error occurred while accessing the database.'
				});
			});

		if (existingUser) {
			return res.status(409).send({ message: `Email '${req.body.email}' already registered.` });
		}

		// Create an User
		const recvUser = this._getUser(req.body);
		const [passwordSalt, passwordHash] = this._encrypt(recvUser.password);
		delete recvUser.password;
		recvUser.passwordSalt = passwordSalt;
		recvUser.passwordHash = passwordHash;

		// email token is created and added to db even if email is disabled
		const emailToken = this._getEmailToken();
		const encodedEmailToken = encodeURIComponent(emailToken);
		recvUser.emailTokenHash = this._encrypt(emailToken, '')[1];

		if (process.env.verifyEmail === 'true') {
			// create email token verification and send email
			recvUser.emailIsVerified = false;

			// send mail with defined transport object
			let info = await transporter.sendMail({
				from: senderAddress, // sender address
				to: recvUser.email, // list of receivers
				subject: 'OAMA Email verification', // Subject line
				text: `Here is your email verification code:

${emailToken}

Open this link to directly verify your email:
${process.env.fqdn}/signup/verify?emailToken=${encodedEmailToken}

Alternatively copy it, then go to ${process.env.fqdn}/signup/verify \
and manually insert the code.`,
				html: `<p>
Here is your email verification code:
</p>
<p>
${emailToken}
</p>

<p>
Open <a href="${process.env.fqdn}/signup/verify?emailToken=${encodedEmailToken}">this link</a> to directly verify your email:
</p>

<p>
Alternatively copy it, then go to <a href="${process.env.fqdn}/signup/verify">${process.env.fqdn}/signup/verify</a> \
and manually insert the code.
</p>`,
			});

			const msg = logInfo(info);
			if (msg) {
				console.log(msg);
			}

		} else {
			// do not verify email: already verified
			recvUser.emailIsVerified = true;
		}

		const user = new this.model(recvUser);

		// Save User in the database
		user
			.save(user)
			.then(data => {
				const user = data.toObject();
				res.status(201).json({ message: 'User created.', data: [user.email] });
			})
			.catch(err => {
				res.status(500).json({
					message: err.message || 'Some error occurred while creating the User.'
				});
			});
	}
}

export default UserController;