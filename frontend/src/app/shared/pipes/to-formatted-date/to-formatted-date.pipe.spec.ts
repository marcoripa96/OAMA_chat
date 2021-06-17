import { TestBed } from '@angular/core/testing';
import { ToFormattedDatePipe } from './to-formatted-date.pipe';

describe('ToFormattedDate', () => {
	let pipe: ToFormattedDatePipe;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ToFormattedDatePipe]
		});

		pipe = new ToFormattedDatePipe();
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('should return the correct mapping', () => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);
		const dayBeforeYesterday = new Date(yesterday);
		dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);

		expect(pipe.transform(today)).toBe('Today');
		expect(pipe.transform(yesterday)).toBe('Yesterday');

		const expectedValue = dayBeforeYesterday.getDate() + '/' +
			dayBeforeYesterday.getMonth() + '/' + dayBeforeYesterday.getFullYear();
		expect(pipe.transform(dayBeforeYesterday)).toBe(expectedValue);
	});
});
