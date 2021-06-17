import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@shared/services/user/user.service';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { InterceptorError } from '@shared/models/error';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from '@shared/services/loader/loader.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
	readonly loading$ = this._loaderService.loading$;
	constructor(
		private _router: Router,
		private _userService: UserService,
		private _loaderService: LoaderService,
		@Inject(TuiNotificationsService) private readonly _notificationsService: TuiNotificationsService
	) { }

	_passwordMatchValidator(group: FormGroup): any {
		return group.get('password').value === group.get('passwordConfirm').value
			? null : { passwordMismatch: true };
	}

	// Form group
	signupForm: FormGroup = new FormGroup({
		email: new FormControl('', [
			Validators.required, Validators.email
		]),
		name: new FormControl('', [
			Validators.required
		]),
		password: new FormControl('', [
			Validators.required, Validators.minLength(8),
			Validators.required, Validators.maxLength(64),
			Validators.pattern('.*[a-z]+.*'), // at least one [a-z] character
			Validators.pattern('.*[A-Z]+.*'), // at least one [A-Z] character
			Validators.pattern('.*[0-9]+.*'), // at least one [0-9] character
			Validators.pattern('.*[?!"#$%&\'`()*+,\\-\\.\\/:;<=>@\\[\\]\\\\^_{|}~]+.*'), // at least one special character
		]),
		passwordConfirm: new FormControl('', [
			// validation already in password
			Validators.required
		])
	}, {
		validators: this._passwordMatchValidator,
		asyncValidators: this._userService.alreadyRegisterValidatorFn(this._userService)
	});

	private _unsubscribeAll = new Subject<void>();

	_whatsInvalid(group: FormGroup) {
		const invalid = [];
		for (const key in group.controls) {
			if (!group.controls[key].valid) {
				invalid.push(key);
			}
		}

		return invalid;
	}

	submitForm() {
		if (this.signupForm.valid) {
			const user = this.signupForm.getRawValue();
			this._userService.create(user).subscribe(res => {
				// show success notification
				this._notificationsService.show('Signup was successful.', { label: 'Success', status: TuiNotification.Success })
					.subscribe();
				this._router.navigate(['login']);
			}, (error: InterceptorError) => {
				// show error notification
				this._notificationsService.show(error.resMessage, { label: error.errorMessage, status: TuiNotification.Error })
					.subscribe();
			});
		} else {
			console.log('Invalid form.');
			const invalidControls = this._whatsInvalid(this.signupForm);
			let errorDesc: string;
			if (invalidControls.length > 0) {
				errorDesc = invalidControls.join(', ') + ' are invalid!';
			} else if (this.signupForm.errors) {
				if ('email' in this.signupForm.errors) {
					errorDesc = 'Email already registered!';
				} else if ('passwordMismatch' in this.signupForm.errors) {
					errorDesc = 'Confirm Password does not match!';
				} else {
					errorDesc = 'Undefined form error F001!';
				}
			} else {
				errorDesc = 'Undefined form error F002!';
			}
			this._notificationsService.show(errorDesc, { label: 'Invalid form.', status: TuiNotification.Error })
				.subscribe();
		}
	}

	ngOnInit(): void {
	}

}
