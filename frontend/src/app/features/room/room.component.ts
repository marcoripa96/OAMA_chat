import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomConfig, RoomConfigService } from '@shared/services/room-config/room-config.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';


/**
 * Provides a component to swap visibilities between
 * creation, access and chat components.
 */
@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

	// Emits changes to the room configuration.
	roomConfig$: Observable<RoomConfig>;

	private _unsubscribeAll = new Subject<void>();

	constructor(
		private readonly _route: ActivatedRoute,
		private readonly _roomConfigService: RoomConfigService
	) { }

	ngOnInit() {
		this._route.params.pipe(
			takeUntil(this._unsubscribeAll),
			map(params => params.room)
		).subscribe(roomName => this._roomConfigService.init(roomName));
		this.roomConfig$ = this._roomConfigService.config$;
	}

	ngOnDestroy() {
		// unsubscribed from all observables
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}

}
