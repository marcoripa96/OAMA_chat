import { Injectable } from '@angular/core';
import { Room } from '@shared/models/room';
import { Subject } from 'rxjs';
import { RoomService } from '../room/room.service';

/**
 * RoomConfig's visibility field.
 */
export enum Visibility {
	create,
	username,
	chat
}

export interface RoomConfig {
	visibility: Visibility;
	name: string;
	username?: string;
	room?: Room;
}

/**
 * Provides a service which sets and returns a RoomConfig.
 */
@Injectable({
	providedIn: 'root'
})
export class RoomConfigService {

	private _currentConfig: RoomConfig;
	_roomConfigSubject: Subject<RoomConfig> = new Subject();

	readonly config$ = this._roomConfigSubject.asObservable();

	constructor(private _roomService: RoomService) { }

	/**
	 * Gives the initial room configuration.
	 */
	init(roomName: string): void {
		const config: RoomConfig = {
			visibility: Visibility.username,
			name: roomName
		};
		this._roomService.findOne(roomName).subscribe(
			(data) => config.room = data.data[0],
			() => config.visibility = Visibility.create
		).add(() => {
			this.set(config);
		});
	}


	/**
	 * Set a new room configuration.
	 */
	set(config: Partial<RoomConfig>): void {
		const newConfig = {...this._currentConfig, ...config};
		this._currentConfig = newConfig;
		this._roomConfigSubject.next(this._currentConfig);
	}


}
