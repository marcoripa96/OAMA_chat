import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Sidebar status to be nexted into the subject
export interface SidebarStatus {
	open: boolean;
	content?: TemplateRef<any>;
	data?: SidebarData;
}

// Siderbar data on close
interface SidebarData {
	from: string;
	value: any;
}

// Default state of the sidebar
const DEFAULT_STATE: SidebarStatus = {
	open: false
};

@Injectable({
	providedIn: 'root'
})
export class SidebarService {
	// Subject which nexts sidebars status
	private _status: BehaviorSubject<SidebarStatus> = new BehaviorSubject(DEFAULT_STATE);

	// Emits the open/close event on subscribe and on nexts
	readonly status$ = this._status.asObservable();

	/**
	 * Get current sidebar status
	 */
	get status(): SidebarStatus {
		return this._status.getValue();
	}

	constructor() { }

	/**
	 * Emits true to all subscribed observable.
	 * The content of sidebar must be specified.
	 */
	show(content: TemplateRef<any>): void {
		const state = {
			open: true,
			content
		};
		this._status.next(state);
	}

	/**
	 * Emits false to all subscribed observable.
	 * Data can also be passed when closing the sidebar.
	 */
	hide(data?: SidebarData): void {
		const state = {
			open: false,
			data
		};
		this._status.next(state);
	}

}
