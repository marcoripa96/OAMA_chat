import { Inject, Injectable, NgZone, OnDestroy, Optional } from '@angular/core';
import { TOKENAPI } from '@shared/tokens/token-api';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { BaseMessage, ChatMessage } from '@shared/models/message';
import { AckMessage } from '@shared/models/error';


export interface SocketConfig {
	socket: any;
}

/**
 * Provides a service to use sockets
 */
@Injectable()
export class SocketService {

	private _socket: Socket | any;

	constructor(@Inject(TOKENAPI) private api: string,
		@Optional() @Inject('SOCKETCONFIG') private config: SocketConfig,
		private ngZone: NgZone) {
	}

	/**
	 * Listen for an event from the server
	 */
	listen(event: string): Observable<any> {
		return new Observable(observer => {
			this._socket.on(event, (res) => {
				// io connection outside of ngZone
				// otherwise it wont update the view
				this.ngZone.run(() => {
					observer.next(res);
				});
			});
		});
	}

	/**
	 * Emit an event to the server
	 */
	emit(channel: string, message: BaseMessage | ChatMessage): Observable<AckMessage> {
		return new Observable(observer => {
			this._socket.emit(channel, message, (data: any) => {
				// io connection outside of ngZone
				// otherwise it wont update the view
				this.ngZone.run(() => {
					observer.next(data);
				});
			});
		});
	}

	connect() {
		if (!this.config) {
			this.ngZone.runOutsideAngular(() => {
				this._socket = io(this.api) as Socket;
			});
		} else {
			this._socket = this.config.socket;
		}
	}

	disconnect() {
		this._socket.disconnect();
	}

	// for testing
	getSocket() {
		return this._socket;
	}

}
