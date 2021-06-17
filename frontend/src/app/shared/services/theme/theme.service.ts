import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

/**
 * Theme interface
 */
export interface Theme {
	selected: string;
	value: string;
}

/**
 * Default Theme configuration
 */
const DEFAULT_THEME: Theme = {
	selected: 'default',
	value: 'default'
};


/**
 * A service whic provides a stream so that the application knows when the theme changes
 */
@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	// Subject which nexts theme settings
	private _theme: BehaviorSubject<Theme> = new BehaviorSubject(this.initTheme);

	// Emits current theme 'default' or 'dark whenever subscribed.
	// it also combines the adaptive theme which emits every hour.
	readonly theme$ = this._theme.asObservable()
		.pipe(
			switchMap(theme => {
				if (theme.selected === 'adaptive') {
					return this.adaptiveTheme$;
				}
				return of(theme);
			}),
			distinctUntilChanged((previous, current) => this._isEqual(previous, current))
		);

	/**
	 * Get inital theme setting
	 */
	get initTheme(): Theme {
		const cachedTheme = this._localStorage.getItem('theme');
		return cachedTheme ? JSON.parse(cachedTheme) : DEFAULT_THEME;
	}

	/**
	 * Get adaptive theme observable
	 */
	get adaptiveTheme$(): Observable<Theme> {
		return this._adaptiveTheme();
	}

	constructor(@Inject(LOCAL_STORAGE) private readonly _localStorage: Storage) { }

	/**
	 * Next a new theme setting into the stream
	 */
	set(theme: string): void {
		const newTheme: Theme = {selected: theme, value: theme};

		this._localStorage.setItem('theme', JSON.stringify(newTheme));
		this._theme.next(newTheme);
	}

	/**
	 * Observable which emits 'default' or 'dark' theme
	 * on subscribe and then on each next full hour
	 *
	 * It is set to modify the theme to 'dark' from 18pm to 5am
	 */
	private _adaptiveTheme(): Observable<Theme> {
		return timer(
			(60 - new Date().getMinutes()) * 60 * 1000, // the next full hour eg. 2:00
			60 * 60 * 1000 // every hour
		).pipe(
			startWith(null as string), // initial request
			map(() => {
				const currentTime = new Date().getHours();
				if (currentTime >= 18 || currentTime <= 5) {
					return {selected: 'adaptive', value:'dark'};
				}
				return {selected: 'adaptive', value:'default'};
			}),
		);
	}

	private _isEqual(previous: Theme, current: Theme): boolean {
		return previous.selected === current.selected && previous.value === current.value;
	}

}
