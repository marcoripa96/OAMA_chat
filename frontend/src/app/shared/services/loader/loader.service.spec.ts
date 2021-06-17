/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { LoaderService } from './loader.service';

describe('Service: Loader', () => {
	let service: LoaderService;
	let testScheduler: TestScheduler;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [LoaderService]
		});

		// get components
		service = TestBed.inject(LoaderService);
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	// test if service gets instantiated
	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should set to loading', () => {
		testScheduler.run(({expectObservable, cold}) => {
			const expectedStatus = {a: true};
			cold('-a').subscribe(() => {service.show();});

			expectObservable(service.loading$).toBe('-a', expectedStatus);
		});
	});

	it('should set to not loading', () => {
		testScheduler.run(({expectObservable, cold}) => {
			const expectedStatus = {a: false};
			cold('-a').subscribe(() => {service.hide();});

			expectObservable(service.loading$).toBe('-a', expectedStatus);
		});
	});

});
