import { NgModule, Pipe, PipeTransform } from '@angular/core';


/**
 * Pipe which maps a Date object to a string corresponding to 'Today',
 * 'Yesterday' or previous date in dd/MM/yy format
 */
@Pipe({
	name: 'toFormattedDate'
})
export class ToFormattedDatePipe implements PipeTransform {

	transform(value: Date): string {
		if (this._isToday(value)) {
			return 'Today';
		} else if (this._isYesterday(value)) {
			return 'Yesterday';
		} else {
			return value.getDate() + '/' + value.getMonth() + '/' + value.getFullYear();
		}
	}

	/**
	 * Returns true if a date is today
	 */
	private _isToday(date: Date): boolean {
		const today = new Date();

		return date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear();
	}

	/**
	 * Returns true if a date is yesterday
	 */
	private _isYesterday(date: Date): boolean {
		const today = new Date();
		const yesterday = new Date(today);

		yesterday.setDate(yesterday.getDate() - 1);

		return date.getDate() === yesterday.getDate() &&
			date.getMonth() === yesterday.getMonth() &&
			date.getFullYear() === yesterday.getFullYear();
	}

}

@NgModule({
	declarations: [ToFormattedDatePipe],
	exports: [ToFormattedDatePipe]
})
export class ToFormattedDatePipeModule { }


