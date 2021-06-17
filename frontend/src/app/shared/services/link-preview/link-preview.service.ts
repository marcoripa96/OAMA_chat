import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { LinkPreviewResponse } from '@shared/models/linkPreview';
import { TOKENAPI } from '@shared/tokens/token-api';
import { Observable } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class LinkPreviewService {

	constructor(private _http: HttpClient, @Inject(TOKENAPI) private _api: string) { }

	/**
	 * Get metadata to render the preview of a provided url.
	 */
	getLinkPreview(targetUrl: string): Observable<LinkPreviewResponse> {
		return this._http.get(`${this._api}/api/utils/getLinkPreview`, { params: { targetUrl } });
	}

}
