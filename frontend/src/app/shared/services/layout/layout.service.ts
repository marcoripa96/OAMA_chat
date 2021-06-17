import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';


export interface LayoutConfig {
	toolbar?: 'hidden' | 'left' | 'center';
}

@Injectable({
	providedIn: 'root'
})
export class LayoutService {

	private _layoutConfig: ReplaySubject<LayoutConfig> = new ReplaySubject(1);
	readonly config$ = this._layoutConfig.asObservable();

	constructor() { }

	set(config: Partial<LayoutConfig>): void {
		// const newConfig = {...this._layoutConfig, ...config};
		this._layoutConfig.next(config);
	}

}
