import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Room, RoomRequest, RoomResponse } from '@shared/models/room';
import { TOKENAPI } from '@shared/tokens/token-api';
import { Observable } from 'rxjs';
import { SHA256 } from 'crypto-js';

/**
 * Provides a service to perform CRUD operations for a Room object.
 */
@Injectable({
	providedIn: 'root'
})
export class RoomService {

	constructor(private _http: HttpClient, @Inject(TOKENAPI) private _api: string) { }

	/**
	 * Access a room
	 */
	access(name: string, password: string): Observable<RoomResponse> {
		const body: any = { name };
		// encrypt password if there is one
		if (password !== '') {
			body.password = this._encrypt(password);
		} else {
			// delete the object field otherwise
			delete body.password;
		}

		return this._http.post<RoomResponse>(`${this._api}/api/room/access`, body);
	}

	/**
	 * Create a new Room.
	 */
	create(room: Room): Observable<RoomResponse> {
		room.password = this._encrypt(room.password);
		return this._http.post<RoomResponse>(`${this._api}/api/room`, room);
	}

	/**
	 * Get a Room by its name.
	 */
	findOne(name: string): Observable<RoomResponse> {
		return this._http.get<RoomResponse>(`${this._api}/api/room/${name}`);
	}

	/**
	 * Get rooms with pagination
	 */
	find(roomRequest: RoomRequest): Observable<RoomResponse> {
		let queryParams = '';
		Object.keys(roomRequest).forEach((key, i) => {
			if (key === 'pagination') {
				Object.keys(roomRequest[key]).forEach((pageKey, j) => {
					queryParams += i === 0 && j ===0 ? `?${pageKey}=${roomRequest[key][pageKey]}` :
						`&${pageKey}=${roomRequest[key][pageKey]}`;
				});
			} else {
				queryParams += i === 0 ? `?${key}=${roomRequest[key]}` : `&${key}=${roomRequest[key]}`;
			}
		});
		return this._http.get<RoomResponse>(`${this._api}/api/room${queryParams}`);
	}

	/**
	 * Update a Room.
	 */
	update(room: Room): Observable<RoomResponse> {
		return this._http.put<RoomResponse>(`${this._api}/api/room/${room._id}`, room);
	}

	/**
	 * Delete a room.
	 */
	delete(room: Room): Observable<RoomResponse> {
		return this._http.delete<RoomResponse>(`${this._api}/api/room/${room._id}`);
	}

	/**
	 * Encrypt a password with SHA256
	 */
	private _encrypt(password: string): string {
		return SHA256(password).toString();
	}

}
