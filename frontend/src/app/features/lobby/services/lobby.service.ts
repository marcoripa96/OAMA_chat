import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RoomRequest, RoomResponse } from '@shared/models/room';
import { RoomService } from '@shared/services/room/room.service';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, scan, startWith, switchMap, tap } from 'rxjs/operators';

/**
 * A service which handles lobby's query searches
 */
@Injectable({
	providedIn: 'root'
})
export class LobbyService {

	// search form
	private _form: FormGroup;
	// keeps track of the current page fetched from the API
	private _currentPage = 0;
	// a subject to next new fetch requests
	private _fetchMore$$: Subject<RoomRequest> = new Subject();


	constructor(private readonly _roomService: RoomService) {
		// init form
		this._form = new FormGroup({
			query: new FormControl('')
		});
	}

	/**
	 * Getter for query form field
	 */
	get query(): FormControl {
		return this._form.get('query') as FormControl;
	}

	/**
	 * Get form reference
	 */
	getForm(): FormGroup {
		return this._form;
	}

	/**
	 * Listen for RoomResponse emit events
	 */
	getRooms(): Observable<RoomResponse> {
		// a first source observable which emits on search change
		const search$ = this.query.valueChanges.pipe(
			startWith(''), // start with empty string so that an initial fetch is triggered
			debounceTime(250),
			distinctUntilChanged(),
			map(query => ({
				request: {
					pagination: { page: 0, resultsPerPage: 21 },
					persistent: true,
					private: false, query
				},
				type: 'search'
			})),
			tap(() => this._currentPage = 0)
		);

		// a second source observable which emits on new fetch events
		const fetchMore$ = this._fetchMore$$.pipe(
			map(request => ({ request, type: 'more' }))
		);

		// merge source obsevables to and return RoomResponse based on which source emits
		return merge(
			search$,
			fetchMore$
		).pipe(
			switchMap(req => combineLatest([this._roomService.find(req.request), of(req.type)])),
			scan((previous: RoomResponse, [res, type]) => type === 'search' ?
				{ data: [...res.data], more: res.more} : { data: [...previous.data, ...res.data], more: res.more }, {} as RoomResponse)
		);
	}

	/**
	 * Fetch next page of the current queried rooms
	 */
	fetchMore(): void {
		this._currentPage++;
		const request: RoomRequest = {
			pagination: {
				page: this._currentPage,
				resultsPerPage: 21
			},
			persistent: false,
			private: false,
			query: this.query.value

		};
		this._fetchMore$$.next(request);
	}

}
