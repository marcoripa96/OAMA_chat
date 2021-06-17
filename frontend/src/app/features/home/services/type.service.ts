import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, from, interval, Observable, timer, zip } from 'rxjs';
import { filter, map, scan, switchMap, takeUntil } from 'rxjs/operators';

export const RANDOM_WORDS = [
	'Dog',
	'Cat',
	'Squirrel',
	'Wollie',
	'Zanfrano',
	'Oamer',
	'Space',
	'Invaders',
	'Calling',
	'Mars',
	'Moon',
	'Earth',
	'Saturn',
	'Pluto',
	'Wind',
	'Fire',
	'Air',
	'Michael',
	'Jordan',
	'Evil',
	'Angel'
];

/**
 * A service which provides an observable which emits a random string char-by-char
 */
@Injectable()
export class TypeService {
	// Subject to next pause or play state
	private _pauseTyping$$: BehaviorSubject<boolean> = new BehaviorSubject(true);
	readonly _play$ = this._pauseTyping$$.asObservable();

	constructor() { }

	/**
	 * Emits a char-by-char random string
	 */
	getTypedString(): Observable<string> {
		const off$ = this._pauseTyping$$.pipe(filter(play => !play));

		return this._pauseTyping$$.pipe(
			filter(play => play),
			switchMap(() =>
				timer(0, 5000).pipe(
					switchMap(() => zip(from(this.getRandomString()), interval(150)).pipe(
						map(([val, _]) => val),
						scan((p, c) => p + c, ''),
						takeUntil(off$))
					)
				))
		);
	}

	/**
	 * Get a random string built with 3 random strings
	 */
	getRandomString(): string {
		let fullString = '';
		for (let i = 0; i < 3; i++) {
			const random = Math.floor(Math.random() * RANDOM_WORDS.length - 1) + 1;
			fullString += RANDOM_WORDS[random];
		}
		return fullString;
	}

	/**
	 * Start or pause char emitting observable
	 */
	startOrPause(state: boolean): void {
		this._pauseTyping$$.next(state);
	}


}
