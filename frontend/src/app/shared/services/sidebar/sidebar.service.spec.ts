/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar.service';


describe('Service: Sidebar', () => {
	let service: SidebarService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				SidebarService,
			]
		});

		// get components
		service = TestBed.inject(SidebarService);
	});

	// test if service gets instantiated
	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should get subject value', () => {
		expect(service.status.open).toBe(false);
	});

	it('should get subject value', (done: DoneFn) => {
		let index = 0;
		const expectedValues = [false, true, false, true, false];
		service.status$.subscribe(status => {
			expect(status.open).toBe(expectedValues[index]);
			index++;
			done();
		});

		service.show(null);
		service.hide();
		service.show(null);
		service.hide();
	});
});
