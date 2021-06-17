import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeIn, listAnimation, translateY } from '@shared/animations/animations';
import { RoomService } from '@shared/services/room/room.service';
import { of, timer } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { TypeService } from './services/type.service';

// Colors of header
export const COLORS = [
	'var(--tui-primary)',
	'var(--tui-support-05)',
	'var(--tui-support-15)'
];

/**
 * Component which displays the homepage
 */
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	animations: [listAnimation, translateY, fadeIn],
	providers: [TypeService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

	// Form which has value of room name input
	form = new FormGroup({
		roomName: new FormControl('')
	});

	// Trackers for animations on intersection observer
	animationTrackers = [
		false,
		false
	];

	// Emits random string char by char
	readonly string$ = this._typeService.getTypedString();

	// Emits a new color every 15s
	readonly color$ = timer(0, 15000).pipe(
		map(i => COLORS[i % COLORS.length])
	);

	// Query db to check if room exists or not and emit status
	readonly room$ = this.roomName.valueChanges.pipe(
		debounceTime(500),
		distinctUntilChanged(),
		switchMap(name =>
			name ?
				this._roomService.findOne(name).pipe(
					map(roomResponse => roomResponse.data ? true : false),
					catchError(() => of(false)))
				: of('reset')
		)
	);

	constructor(
		private _router: Router,
		private readonly _typeService: TypeService,
		private readonly _roomService: RoomService,
	) { }

	/**
	 * Getter for roomName form control
	 */
	get roomName(): FormControl {
		return this.form.get('roomName') as FormControl;
	}

	ngOnInit() { }

	/**
	 * Trigger event on focus change of room input
	 */
	onFocusChange(focus: boolean): void {
		this._typeService.startOrPause(!focus);
	}

	/**
	 * Trigger on submit of room form
	 */
	submitRoom(): void {
		this._router.navigate([this.roomName.value]);
	}

	/**
	 * Trigger on element intersection to change animation tracker state
	 */
	onIntersection(entries, index: number): void {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				this.animationTrackers[index] = true;
			}
		});
	}


}
