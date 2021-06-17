import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface BlobConfig {
	color: string;
}

@Injectable({
	providedIn: 'root'
})
export class BlobService {

	private _blobConfigSubject: Subject<BlobConfig> = new Subject();

	readonly config$ = this._blobConfigSubject.asObservable();

	constructor() { }

	set(config: BlobConfig): void {
		this._blobConfigSubject.next(config);
	}

}
