import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InterceptorError } from '@shared/models/error';
import { UserService } from '@shared/services/user/user.service';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-verify',
	templateUrl: './verify.component.html',
	styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _userService: UserService,
		@Inject(TuiNotificationsService) private readonly _notificationsService: TuiNotificationsService
	) { }

	// Form group
	verifyForm: FormGroup = new FormGroup({
		emailToken: new FormControl('', [
			Validators.required
		])
	});

	submitForm() {
		if (this.verifyForm.valid) {
			const emailToken = this.verifyForm.getRawValue().emailToken.trim();
			this._userService.verifyEmail(emailToken).subscribe(res => {
				// show success notification
				const message = res.message || 'Email verified successfully.';
				this._notificationsService.show(message, { label: 'Success', status: TuiNotification.Success })
					.subscribe();
				this._router.navigate(['login']);
			}, (error: InterceptorError) => {
				// show error notification
				this._notificationsService.show(error.resMessage, { label: error.errorMessage, status: TuiNotification.Error })
					.subscribe();
			});
		} else {
			console.log('Invalid form.');
			const errorDesc = '`Email Verification Token` is required.';
			this._notificationsService.show(errorDesc, { label: 'Invalid form.', status: TuiNotification.Error })
				.subscribe();
		}
	}

	ngOnInit(): void {
		this._route.queryParams
			.pipe(filter(params => params.emailToken))
			.subscribe(params => {
				this.verifyForm.setValue({
					emailToken: params.emailToken
				});
				this.submitForm();
			});
	}

}
