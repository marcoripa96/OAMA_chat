import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateFormConfig } from '@shared/components/create-room-form/create-room-form.component';
import { CreateRoomFormModule } from '@shared/components/create-room-form/create-room-form.module';
import { RoomService } from '@shared/services/room/room.service';
import { TOKENAPI } from '@shared/tokens/token-api';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';
import { environment } from 'environments/environment';
import { CreateRoomComponent } from './create-room.component';



describe('CreateRoomComponent', () => {

	let fixture: ComponentFixture<CreateRoomComponent>;
	let roomService: RoomService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				BrowserAnimationsModule,
				TuiMapperPipeModule,
				CreateRoomFormModule
			],
			declarations: [
				CreateRoomComponent
			],
			providers: [
				RoomService,
				{ provide: TOKENAPI, useValue: environment.backendUrl },
			]
		}).compileComponents();

		fixture = TestBed.createComponent(CreateRoomComponent);
		roomService = TestBed.inject(RoomService);
	});

	// check if component gets instantiated
	it('should create the component', () => {
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should show room name with first letter in upper case', () => {
		const component = fixture.componentInstance;
		const debugElement = fixture.debugElement;

		component.roomName = 'roomname';

		fixture.detectChanges();

		const title = debugElement.query(By.css('.title')).nativeElement;

		expect(title.innerHTML).toContain('Roomname');

	});

	it('should create a new room', () => {

		const component = fixture.componentInstance;
		component.roomName = 'roomname';

		const formConfig: CreateFormConfig = {
			name: { value: '', disabled: true, validators: [Validators.required] },
			private: { value: false, disabled: false, validators: [Validators.required] },
			password: { value: '', disabled: false, validators: [Validators.minLength(6)] },
			persistent: { value: false, disabled: false, validators: [Validators.required] },
			description: {value: '', disabled: false, validators: [Validators.maxLength(90)]}
		};

		component.formConfig = formConfig;
		fixture.detectChanges();

		spyOn(component, 'createRoom');

		// trigger the click
		const debugElement = fixture.debugElement;

		debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

		expect(component.createRoom).toHaveBeenCalledTimes(1);

	});

});
