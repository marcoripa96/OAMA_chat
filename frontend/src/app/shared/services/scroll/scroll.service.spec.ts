/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
	let service: ScrollService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ScrollService]
		});

		service = TestBed.inject(ScrollService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should emit initial value', (done: DoneFn) => {
		service.scroll$.subscribe(scrollY => {
			expect(scrollY).toBe(0);
			done();
		});
	});

	it('should emit new values', (done: DoneFn) => {
		const expectedValues = [20, 40, 60, 80];
		let index = 0;

		service.scroll$.subscribe(scrollY => {
			if (index === 0) {
				expect(scrollY).toBe(0);
			} else {
				expect(scrollY).toBe(expectedValues[index-1]);
			}
			index++;
			done();
		});

		expectedValues.forEach(val => service.updateScrollY(val));
	});
});
