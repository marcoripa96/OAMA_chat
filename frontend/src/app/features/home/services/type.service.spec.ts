/* tslint:disable:no-unused-variable */

import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { RANDOM_WORDS, TypeService } from './type.service';

describe('TypeService', () => {
	let service: TypeService;
	const  randomWords = RANDOM_WORDS;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [TypeService]
		});

		service = TestBed.inject(TypeService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should pause or resume observable from emitting', (done: DoneFn) => {
		const expectedValues = [true, false, true];
		let index = 0;

		service._play$.subscribe(res => {
			expect(res).toBe(expectedValues[index]);
			index ++;
			done();
		});

		service.startOrPause(false);
		service.startOrPause(true);
	});

	it('should emit each character of a random string', fakeAsync(() => {
		let finalWord: string;

		service.getTypedString().subscribe(subword => {
			if (subword.length === 1) {
				expect(subword.length).toBe(1);
			} else {
				expect(subword.length).toBe(finalWord.length + 1);
			}
			finalWord = subword;
		});
		tick(150);
		tick(150);
		tick(150);

		discardPeriodicTasks();
	}));

});
