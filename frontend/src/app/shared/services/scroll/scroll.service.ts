import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * A service which propagates scroll events to all subscribers
 */
@Injectable({
	providedIn: 'root'
})
export class ScrollService {
	// Subject which nexts new scroll position
	private _scroll$$: BehaviorSubject<number> = new BehaviorSubject(0);

	// Emits new scroll position if subscribed to
	readonly scroll$ = this._scroll$$.asObservable();

	constructor() { }

	// Update scroll position
	updateScrollY(value: number): void {
		this._scroll$$.next(value);
	}

}
