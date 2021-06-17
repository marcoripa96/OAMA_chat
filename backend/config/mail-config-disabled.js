console.log('Dummy mail config. It implies `verifyEmail=false`.');

const transporter = null;

const senderAddress = null;

/**
 * Debugging function useful for test account
 */
function logInfo(info) {
	console.log(info);
}

export { transporter, senderAddress, logInfo };
