import { Inject, Injectable, OnDestroy } from '@angular/core';
import { SocketService } from '@shared/services/socket.service';
import { merge, Observable, of, Subject } from 'rxjs';
import { BaseMessage, ChatMessage, ChatMessageResponse } from '@shared/models/message';
import { AckMessage } from '@shared/models/error';
import { HttpClient } from '@angular/common/http';
import { TOKENAPI } from '@shared/tokens/token-api';
import { MessageService } from '@shared/services/message/message.service';
import { map, scan, share, switchMap, takeUntil } from 'rxjs/operators';
import { RoomConfig } from '@shared/services/room-config/room-config.service';
import { BaseUserAction, UserActionKick } from '@shared/models/userAction';

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

	private readonly _newTypedMessage$$: Subject<ChatMessage> = new Subject();

	constructor(
		private readonly _socketService: SocketService,
		private readonly _messageService: MessageService,
		private _http: HttpClient,
		@Inject(TOKENAPI) private _api: string
	) {
		// connect to the server when the service gets instantiated
		this._socketService.connect();
	}

	ngOnDestroy() {
		// disconnect from the server when the service gets destroyed
		this._socketService.disconnect();
	}

	/**
	 * Open socket connection
	 */
	onConnect(): Observable<boolean> {
		return this._socketService.listen('connect');
	}

	/**
	 * Join a given room
	 */
	private _joinRoom(message: BaseMessage): Observable<AckMessage> {
		return this._socketService.emit('join-room', message);
	}

	/**
	 * Listen for new messages
	 */
	private _getMessage(): Observable<ChatMessage> {
		return this._socketService.listen('new-message');
	}

	/**
	 * Emit a new message
	 */
	sendMessage(message: ChatMessage): Observable<AckMessage> {
		return this._socketService.emit('new-message', message);
	}

	/**
	 * Add a new message to messages stream
	 */
	addMessage(message: ChatMessage): void {
		this._newTypedMessage$$.next(message);
	}

	/**
	 * Listen for new messages
	 */
	getStickyMessage(): Observable<ChatMessage> {
		return this._socketService.listen('new-sticky-message');
	}

	/**
	 * Emit a new sticky message
	 */
	sendStickyMessage(message: ChatMessage): Observable<AckMessage> {
		return this._socketService.emit('new-sticky-message', message);
	}

	/**
	 * Emit a remove of sticky message
	 */
	removeStickyMessage(message: ChatMessage): Observable<AckMessage> {
		return this._socketService.emit('remove-sticky-message', message);
	}

	/**
	 * Listen for remove sticky messages
	 */
	 getRemoveStickyMessage(): Observable<ChatMessage> {
		return this._socketService.listen('remove-sticky-message');
	}

	/**
	 * Join a room after connection to the server is established
	 */
	connectAndJoinRoom(roomConfig: RoomConfig): Observable<AckMessage> {
		return this.onConnect().pipe(
			switchMap(() => {
				const message: BaseMessage = {
					room: roomConfig.name,
					username: roomConfig.username
				};
				return this._joinRoom(message);
			})
		);
	}

	/**
	 * Get stored room messages, listen for new incoming messages and sent messages
	 */
	getMessages(roomName: string): Observable<ChatMessage[]> {
		// get old messages
		const storedMessages$ = this._messageService.find(roomName).pipe(
			map(res => res.data),
			share()
		);
		// listen for new incoming messages both from sockets and add events
		const newMessages$ = merge(
			this._getMessage(),
			this._newTypedMessage$$
		);

		// capture all missed messages from sockets until the fetch for old messages
		// is done.
		const missedMessages$ = newMessages$.pipe(
			takeUntil(storedMessages$),
		);

		// emits all initial messages (stored and missed)
		const initialMessages$ = merge(
			storedMessages$,
			missedMessages$
		);
		// scan to aggregate all messages and keep lestening for new ones
		return merge(initialMessages$, newMessages$).pipe(
			scan((p, c) => Array.isArray(c) ? [...p, ...c] : [...p, c], [])
		);
	}

	/**
	 * Listen for number of partecipants updates
	 */
	getNumberOfPartecipants(): Observable<number> {
		return this._socketService.listen('counter-update');
	}

	/**
	 * Listen for active users changes
	 */
	getActiveUsers(): Observable<string[]> {
		return this._socketService.listen('active-users');
	}

	/**
	 * Query to find messages of a room. It requires a room name, a query and a filter.
	 */
	searchMessage(room: string, query: string, filter: string): Observable<ChatMessageResponse> {
		return this._http.get<ChatMessageResponse>(`${this._api}/api/rooms/${room}/messages?query=${query}&filter=${filter}`);
	}

	/**
	 * Listen for users actions
	 */
	getUserAction(): Observable<any> {
		return this._socketService.listen('user-action');
	}

	/**
	 * Listen for incoming user kick
	 */
	getUserKick(): Observable<string> {
		return this._socketService.listen('kick-user');
	}

	/**
	 * Emit a user kick
	 */
	kickUser(username: string, room: string): Observable<AckMessage> {
		return this._socketService.emit('kick-user', { username, room });
	}

	/**
	 * Close socket connection
	 */
	onDisconnect(): Observable<DisconnectReason> {
		return this._socketService.listen('disconnect');
	}

}
