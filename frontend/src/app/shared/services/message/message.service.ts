import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ChatMessage, ChatMessageResponse } from '@shared/models/message';
import { TOKENAPI } from '@shared/tokens/token-api';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MessageService {

	constructor(private _http: HttpClient, @Inject(TOKENAPI) private _api: string) { }

	/**
	 * Create a new Message.
	 */
	create(message: ChatMessage): Observable<ChatMessageResponse> {
		return this._http.post<ChatMessageResponse>(`${this._api}/api/message`, message);
	}

	/**
	 * Find a message by id
	 */
	findOne(id: string): Observable<ChatMessageResponse> {
		return this._http.get<ChatMessageResponse>(`${this._api}/api/message/${id}`);
	}

	/**
	 * Find messages. FindAll or search by content and filter.
	 */
	find(room?: string, content?: string, filter?: string): Observable<ChatMessageResponse> {
		let queryParams = '';
		if (room) {
			queryParams += `?roomId=${room}`;
		}
		if (content) {
			if (queryParams === '') {
				queryParams += `?content=${content}`;
			} else {
				queryParams += `&content=${content}`;
			}
		}
		if (filter) {
			if (queryParams === '') {
				queryParams += `?filter=${filter}`;
			} else {
				queryParams += `&filter=${filter}`;
			}
		}
		return this._http.get<ChatMessageResponse>(`${this._api}/api/message${queryParams}`);
	}

	/**
	 * Update a message.
	 */
	update(message: ChatMessage): Observable<ChatMessageResponse> {
		return this._http.put<ChatMessageResponse>(`${this._api}/api/message/${message._id}`, message);
	}

	/**
	 * Delete a message.
	 */
	delete(message: ChatMessage): Observable<ChatMessageResponse> {
		return this._http.delete<ChatMessageResponse>(`${this._api}/api/message/${message._id}`);
	}




}
