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

import { VerifyComponent } from './verify.component';

describe('VerifyComponent', () => {
	let fixture: ComponentFixture<VerifyComponent>;
	let userService: UserService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [
				VerifyComponent
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

		fixture = TestBed.createComponent(VerifyComponent);
		userService = TestBed.inject(UserService);
	});

	it('should create', () => {
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('empty form should be invalid', () => {
		const component = fixture.componentInstance;
		expect(component.verifyForm.valid).toBeFalsy();
	});

	it('should fill a valid form', () => {
		const component = fixture.componentInstance;

		component.verifyForm.patchValue({
			emailToken: 'exampleToken'
		});

		fixture.detectChanges();

		expect(component.verifyForm.valid).toBeTruthy();
	});
});
