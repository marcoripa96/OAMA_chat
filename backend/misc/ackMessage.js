class AckMessage {
	constructor(event, success, errcode, message, data) {
		this.event = event;
		this.success = success;
		this.errcode = errcode;
		this.message = message;
		this.data = data;
	}
}

export class AckSuccess extends AckMessage {
	constructor(event, data = null) {
		super(event, true, null, null, data);
	}
}

export class AckError extends AckMessage {
	constructor(event, errcode, message, data = null) {
		super(event, false, errcode, message, data);
	}
}