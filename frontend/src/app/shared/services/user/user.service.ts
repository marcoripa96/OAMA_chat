import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TOKENAPI } from '@shared/tokens/token-api';
import { Observable, of, throwError } from 'rxjs';
import { User, UserResponse } from '@shared/models/user';
import { SHA256 } from 'crypto-js';
import { AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { InterceptorError } from '@shared/models/error';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	constructor(private _http: HttpClient, @Inject(TOKENAPI) private _api: string) { }

	/**
	 * Encrypt a password with SHA256
	 */
	private _encrypt(password: string): string {
		return SHA256(password).toString();
	}

	/**
	 * Async validator to check if email is already registered
	 */
	alreadyRegisterValidatorFn(userService: UserService): AsyncValidatorFn {
		return (group: FormGroup): Observable<ValidationErrors> => userService.exists(group.get('email').value).pipe(map(
			(resp: UserResponse) =>
			// code should be 200
			// user already exists. email Validator is invalid!
					 ({
					email: 'Email already registered'
				})

		),
		catchError((error: InterceptorError) => {
			if (error.error.status === 404) {
				// user not found (404). then we can create the user
				return of({});
			} else {
				throwError(error);
			}
		})
		);
	}

	/**
	 * Check if user exists
	 */
	exists(email: string): Observable<UserResponse> {
		return this._http.post<UserResponse>(`${this._api}/api/user/exists`, { email });
	}

	/**
	 * Create a new User.
	 */
	create(userObj: any): Observable<UserResponse> {
		if ('passwordConfirm' in userObj) {
			delete userObj.passwordConfirm;
		}

		const password = this._encrypt(userObj.password);
		delete userObj.password;

		const user: User = {
			email: userObj.email,
			name: userObj.name,
			password,
			date: new Date()
		};

		return this._http.post<UserResponse>(`${this._api}/api/user`, user);
	}

	/**
	 * Verify email
	 */
	verifyEmail(emailToken: string): Observable<UserResponse> {
		return this._http.post<UserResponse>(`${this._api}/api/user/verifyEmail`, {emailToken});
	}
}
