import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InterceptorError } from '@shared/models/error';
import { LoaderService } from '@shared/services/loader/loader.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

/**
 * Provides an interceptor to handle HTTP and client errors.
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

	constructor(
		private loaderService: LoaderService,
	) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		this.loaderService.show();

		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				let errorMessage: InterceptorError;
				if (!(error.error instanceof ErrorEvent)) {
					// server-side error
					errorMessage = {
						errorMessage: `Error Code: ${error.status}\ - ${error.statusText}`,
						resMessage: error.error ? error.error.message : '',
						error
					};
				}

				return throwError(errorMessage);
			}),
			finalize(() => this.loaderService.hide())
		);
	}
}
