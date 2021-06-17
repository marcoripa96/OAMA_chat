import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '@features/home/home.module';
import { UserService } from '@shared/services/user/user.service';
import { TOKENAPI } from '@shared/tokens/token-api';
import { TuiButtonModule, TuiNotificationModule } from '@taiga-ui/core';
import { TuiInputModule, TuiInputPasswordModule, TuiIslandModule } from '@taiga-ui/kit';
import { environment } from 'environments/environment';

import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
	let fixture: ComponentFixture<SignupComponent>;
	let userService: UserService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [
				SignupComponent
			],
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
				CommonModule,
				FormsModule,
				ReactiveFormsModule,
				RouterModule.forChild(routes),
				TuiButtonModule,
				TuiInputModule,
				TuiInputPasswordModule,
				TuiIslandModule,
				TuiNotificationModule
			],
			providers: [
				{ provide: TOKENAPI, useValue: environment.backendUrl },
			]
		}).compileComponents();

		fixture = TestBed.createComponent(SignupComponent);
		userService = TestBed.inject(UserService);
	});


	it('should create', () => {
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('empty form should be invalid', () => {
		const component = fixture.componentInstance;
		expect(component.signupForm.valid).toBeFalsy();
	});

	it('should fill a valid form', () => {
		const component = fixture.componentInstance;

		const _password = 'SUp3rSecre!!';

		// async validator requires http call
		component.signupForm.clearAsyncValidators();
		component.signupForm.patchValue({
			email: 'example@example.com',
			name: 'John Smith',
			password: _password,
			passwordConfirm: _password
		});

		fixture.detectChanges();

		expect(component.signupForm.valid).toBeTruthy();
	});

	it('form should be invalid when email is invalid', () => {
		const component = fixture.componentInstance;

		const _password = 'SUp3rSecre!!';

		// async validator requires http call
		component.signupForm.clearAsyncValidators();
		component.signupForm.patchValue({
			email: 'notvalid',
			name: 'John Smith',
			password: _password,
			passwordConfirm: _password
		});

		fixture.detectChanges();

		expect(component.signupForm.valid).toBeFalsy();
		expect(component.signupForm.controls.email.valid).toBeFalsy();
	});

	it('form should be invalid when password is invalid', () => {
		const component = fixture.componentInstance;

		const _password = 'onlylowercase';

		// async validator requires http call
		component.signupForm.clearAsyncValidators();
		component.signupForm.patchValue({
			email: 'example@example.com',
			name: 'John Smith',
			password: _password,
			passwordConfirm: _password
		});

		fixture.detectChanges();

		expect(component.signupForm.valid).toBeFalsy();
		expect(component.signupForm.controls.password.valid).toBeFalsy();
	});

	it('form should be invalid when password and passwordConfirm do not match', () => {
		const component = fixture.componentInstance;

		// async validator requires http call
		component.signupForm.clearAsyncValidators();
		component.signupForm.patchValue({
			email: 'example@example.com',
			name: 'John Smith',
			password: 'SUp3rSecre!!',
			passwordConfirm: 'SUp3rSecre!!to'
		});

		fixture.detectChanges();

		expect(component.signupForm.valid).toBeFalsy();
		expect('passwordMismatch' in component.signupForm.errors).toBeTruthy();
	});
});
