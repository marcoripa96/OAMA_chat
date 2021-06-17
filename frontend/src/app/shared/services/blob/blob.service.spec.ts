/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { BlobConfig, BlobService } from './blob.service';

describe('BlobService', () => {
	let service: BlobService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [BlobService]
		});

		service = TestBed.inject(BlobService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should set a new config and emit it', ((done: DoneFn) => {

		const expectedConfig: BlobConfig = {
			color: 'red'
		};

		service.config$.subscribe(config =>  {
			expect(config).toEqual(expectedConfig);
			done();
		});

		service.set(expectedConfig);


	}));
});
