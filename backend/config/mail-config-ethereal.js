import nodemailer from 'nodemailer';

const testAccount = await nodemailer.createTestAccount();

console.log(`Using user ${testAccount.user}`);

const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: testAccount.user, // generated ethereal user
		pass: testAccount.pass, // generated ethereal password
	},
});

const senderAddress = '"OAMA" <oama@example.com>';

/**
 * Debugging function useful for test account
 */
function logInfo(info) {
	let msg = 'Message sent: ' + info.messageId;
	msg += '\nPreview URL: ' + nodemailer.getTestMessageUrl(info);
	return msg;
}

export { transporter, senderAddress, logInfo };











