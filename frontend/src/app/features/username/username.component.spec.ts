import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import {TuiButtonModule, TuiLabelModule, TuiSvgModule, TuiTextfieldControllerModule} from '@taiga-ui/core';
import {TuiInputComponent, TuiInputModule, TuiInputPasswordModule, TuiIslandModule} from '@taiga-ui/kit';
import { UsernameComponent } from './username.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RoomConfig, RoomConfigService, Visibility } from '@shared/services/room-config/room-config.service';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UsernameComponent', () => {
	let component: UsernameComponent;
	let fixture: ComponentFixture<UsernameComponent>;
	let de: DebugElement;
	let el: HTMLElement;

	beforeEach( waitForAsync (() => {
		TestBed.configureTestingModule({
			declarations: [
				UsernameComponent
			],
			imports:[
				HttpClientTestingModule,
				BrowserAnimationsModule,
				TuiButtonModule,
				FormsModule,
				ReactiveFormsModule,
				TuiLabelModule,
				TuiTextfieldControllerModule,
				TuiInputModule,
				TuiIslandModule,
				TuiInputPasswordModule,
				TuiMapperPipeModule,
				TuiSvgModule
			],
			providers: [
				RoomConfigService,
				{ provide: TOKENAPI, useValue: environment.backendUrl }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(UsernameComponent);
		component = fixture.componentInstance;


	}));

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should create a form without a password input', () => {
		const roomConfig: RoomConfig = {
			name: 'room',
			visibility: Visibility.username,
			room: {name: 'room', private: false, stickyMessages: []}
		};

		component.roomConfig = roomConfig;
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		/**
		 * Check that there are all the elements
		 */
		const formElement = debugElement.query(By.css('form')).nativeElement;
		const usernameInput = debugElement.query(By.css('#username-input')).nativeElement;
		const enterButton = debugElement.query(By.css('.enter-button')).nativeElement;
		const inputPassword = debugElement.query(By.css('tui-input-password'));
		const expectedForm = {
			username: 'Fellow Oamer',
		};

		expect(formElement).toBeTruthy();
		expect(usernameInput).toBeTruthy();
		expect(enterButton).toBeTruthy();
		expect(inputPassword).toBeFalsy();
		expect(component.userForm.getRawValue()).toEqual(expectedForm);
	});


	it('should create a form with a password input', () => {
		const roomConfig: RoomConfig = {
			name: 'room',
			visibility: Visibility.username,
			room: {name: 'room', private: true, stickyMessages: []}
		};

		component.roomConfig = roomConfig;
		fixture.detectChanges();
		const debugElement = fixture.debugElement;


		const formElement = debugElement.query(By.css('form')).nativeElement;
		const usernameInput = debugElement.query(By.css('#username-input')).nativeElement;
		const enterButton = debugElement.query(By.css('.enter-button')).nativeElement;
		const inputPassword = debugElement.query(By.css('tui-input-password')).nativeElement;

		const expectedForm = {
			username: 'Fellow Oamer',
			password: ''
		};

		expect(formElement).toBeTruthy();
		expect(usernameInput).toBeTruthy();
		expect(enterButton).toBeTruthy();
		expect(inputPassword).toBeTruthy();
		expect(component.userForm.getRawValue()).toEqual(expectedForm);
	});

	it('should enter a room if form is valid on submit', () => {
		const roomConfig: RoomConfig = {
			name: 'room',
			visibility: Visibility.username,
			room: {name: 'room', private: false, stickyMessages: []}
		};

		component.roomConfig = roomConfig;
		fixture.detectChanges();


		spyOn(component, 'enterRoom');
		fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', null); ;

		/**
		 * Check that enterRoom function is executed only once
		 */
		expect(component.userForm.valid).toBeTruthy();
		expect(component.enterRoom).toHaveBeenCalledTimes(1);
	});

	it('should delete username of input is focused', () => {
		const roomConfig: RoomConfig = {
			name: 'room',
			visibility: Visibility.username,
			room: {name: 'room', private: false, stickyMessages: []}
		};

		component.roomConfig = roomConfig;
		fixture.detectChanges();
		const debugElement = fixture.debugElement;

		const usernameInput = debugElement.query(By.css('#username-input')).componentInstance as TuiInputComponent;
		usernameInput.focusedChange.emit(true);
		fixture.detectChanges();

		expect(component.userForm.getRawValue().username).toBe('');
	});

});
