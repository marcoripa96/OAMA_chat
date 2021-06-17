/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('Service: Theme', () => {
	let service: ThemeService;

	const timeUntilOppositeTheme = (currentTime: number): number => {
		if (currentTime >= 18 || currentTime <= 5) {
			if (currentTime >= 18 && currentTime <= 23) {
				return 24 - currentTime + 6;
			}
			return 6 - currentTime;

		}
		return 18 - currentTime;
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ThemeService,
			]
		});

		// get components
		service = TestBed.inject(ThemeService);
	});

	afterEach(() => {
		window.localStorage.removeItem('theme');
	});

	// test if service gets instantiated
	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should emit the current theme', (done: DoneFn) => {
		let index = 0;

		const currentTime = new Date().getHours();
		const adaptiveCurrentTheme = currentTime >= 18 || currentTime <= 5 ?
			{ selected: 'adaptive', value: 'dark' } : { selected: 'adaptive', value: 'default' };

		const expectedValues = [
			{ selected: 'default', value: 'default' },
			{ selected: 'dark', value: 'dark' },
			adaptiveCurrentTheme
		];

		service.theme$.subscribe(open => {
			expect(open).toEqual(expectedValues[index]);
			index++;
			done();
		});

		service.set('dark');
		service.set('adaptive');
	});

	it('should get time until opposite theme', () => {
		const times = [23, 17, 2, 6];
		const expectedTimes = [7, 1, 4, 12];

		times.forEach((time, index) => {
			expect(timeUntilOppositeTheme(time)).toBe(expectedTimes[index]);
		});
	});

	it('should emit current theme correctly for adaptive theme', fakeAsync(() => {
		service.set('adaptive');
		let index = 0;
		const currentTime = new Date().getHours();
		const currentTheme = currentTime >= 18 || currentTime <= 5 ?
			{ selected: 'adaptive', value: 'dark' } : { selected: 'adaptive', value: 'default' };
		const oppositeTheme = currentTheme.value === 'dark' ?
			{ selected: 'adaptive', value: 'default' } : { selected: 'adaptive', value: 'dark' };

		const expectedThemes = [currentTheme, oppositeTheme];

		const timeUntilOpposite = timeUntilOppositeTheme(currentTime);
		const subscription = service.theme$.subscribe(theme => {
			expect(theme).toEqual(expectedThemes[index]);
			index++;
		});
		tick(timeUntilOpposite * 60 * 60 * 1000);
		subscription.unsubscribe();
	}));

});
