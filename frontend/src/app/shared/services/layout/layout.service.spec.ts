/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { LayoutConfig, LayoutService } from './layout.service';

describe('Service: Layout', () => {
	let service: LayoutService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [LayoutService]
		});

		service = TestBed.inject(LayoutService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should set a new config and emit it', ((done: DoneFn) => {

		const expectedConfig: LayoutConfig = {
			toolbar: 'center'
		};

		service.config$.subscribe(config =>  {
			expect(config).toEqual(expectedConfig);
			done();
		});

		service.set(expectedConfig);


	}));
});
