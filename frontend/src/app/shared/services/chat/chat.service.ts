import { Injectable, OnDestroy } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
import { SocketService } from '@shared/services/socket.service';
import { Observable } from 'rxjs';
import { BaseMessage, ChatMessage } from '@shared/models/message';
import { AckMessage } from '@shared/models/error';

export const enum DisconnectReason {
	serverManual = 'io server disconnect',
	clientManual = 'io client disconnect',
	transportClose = 'transport close',
	transportError = 'transport error',
	pingTimeout = 'ping timeout'
}

/**
 * Provides a service to perform messages exchange and get chat information
 */
@Injectable()
export class ChatService implements OnDestroy {

	constructor(private _socketService: SocketService) {
		this._socketService.connect();
	}

	ngOnDestroy() {
		this._socketService.disconnect();
	}

	/**
	 * Join a given room
	 */
	joinRoom(message: BaseMessage): Observable<AckMessage> {
		return this._socketService.emit('join-room', message);
	}

	/**
	 * Emit a new message
	 */
	sendMessage(message: ChatMessage): Observable<AckMessage> {
		return this._socketService.emit('new-message', message);
	}

	/**
	 * Listen for a new message
	 */
	getMessage(): Observable<ChatMessage> {
		return this._socketService.listen('new-message');
	}

	/**
	 * Emit a new sticky message
	 */
	sendStickyMessage(message: ChatMessage): Observable<AckMessage> {
		return this._socketService.emit('new-sticky-message', message);
	}

	/**
	 * Listen for a new sticky message
	 */
	getStickyMessage(): Observable<ChatMessage> {
		return this._socketService.listen('new-sticky-message');
	}

	/**
	 * Listen for number of partecipants updates
	 */
	getNumberOfPartecipants(): Observable<number> {
		return this._socketService.listen('counter-update');
	}

	/**
	 * Open socket connection
	 */
	onConnect(): Observable<boolean> {
		return this._socketService.listen('connect');
	}

	/**
	 * Close socket connection
	 */
	onDisconnect(): Observable<DisconnectReason> {
		return this._socketService.listen('disconnect');
	}

}
