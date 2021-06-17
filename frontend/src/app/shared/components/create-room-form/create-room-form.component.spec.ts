import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderService } from '@shared/services/loader/loader.service';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { CreateFormConfig, CreateRoomFormComponent } from './create-room-form.component';
import { CreateRoomFormModule } from './create-room-form.module';


describe('CreateRoomFormComponent', () => {

	let fixture: ComponentFixture<CreateRoomFormComponent>;
	let testScheduler: TestScheduler;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				BrowserAnimationsModule,
				CreateRoomFormModule
			],
			declarations: [
			],
			providers: [
				LoaderService
			]
		}).compileComponents();

		fixture = TestBed.createComponent(CreateRoomFormComponent);

		const formConfig: CreateFormConfig = {
			name: { value: 'roomName', disabled: true, validators: [Validators.required] },
			private: { value: false, disabled: false, validators: [Validators.required] },
			password: { value: '', disabled: false, validators: [Validators.minLength(6)] },
			persistent: { value: false, disabled: false, validators: [Validators.required] },
			description: { value: '', disabled: false, validators: [Validators.maxLength(150)]}
		};

		// create form
		const component = fixture.componentInstance;
		component.formConfig = formConfig;
		// run ngOnInit
		component.ngOnInit();
		fixture.detectChanges();

		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	// check if component gets instantiated
	it('should create the component', () => {
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should create the form', () => {
		const component = fixture.componentInstance;

		const expectedForm = {
			name: 'roomName',
			private: false,
			password: '',
			persistent: false,
			description: ''
		};

		expect(component.createForm.getRawValue()).toBeTruthy();
		expect(component.createForm.getRawValue()).toEqual(expectedForm);

		const debugElement = fixture.debugElement;
		const inputRoomName = debugElement.query(By.css('#room-name-input')).nativeElement;
		const inputPassword = debugElement.query(By.css('.create-panel tui-input-password')).nativeElement;
		const button = debugElement.query(By.css('.create-button')).nativeElement;

		expect(inputRoomName).toBeTruthy();
		expect(inputPassword).toBeTruthy();
		expect(button).toBeTruthy();

	});

	it('should emit if form is valid and invalid', () => {
		const component = fixture.componentInstance;

		testScheduler.run(({ expectObservable }) => {
			const expectedMarbles = '(ab|)';
			const expectedStatus = { a: true, b: false };
			component.formStatus$ = of(true, false);

			expectObservable(component.formStatus$).toBe(expectedMarbles, expectedStatus);
		});

	});

	it('should emit a room with no password on submit', () => {
		const component = fixture.componentInstance;
		spyOn(component.create, 'emit');

		const debugElement = fixture.debugElement;
		// trigger submit
		debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

		const expectedEmitValue = component.createForm.getRawValue();

		fixture.detectChanges();
		expect(component.createForm.valid).toBeTrue();
		expect(component.create.emit).toHaveBeenCalledWith(expectedEmitValue);
	});

	it('should emit a room with a password on submit', () => {
		const component = fixture.componentInstance;
		spyOn(component.create, 'emit');

		const debugElement = fixture.debugElement;

		// set a password
		component.createForm.patchValue({
			password: 'password'
		});

		// trigger emit
		debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

		const expectedEmitValue = component.createForm.getRawValue();
		expectedEmitValue.private = true;

		fixture.detectChanges();
		expect(component.createForm.valid).toBeTrue();
		expect(component.create.emit).toHaveBeenCalledWith(expectedEmitValue);
	});

	it('should not emit if password is invalid', () => {
		const component = fixture.componentInstance;
		fixture.detectChanges();

		spyOn(component.create, 'emit');

		// get button
		const debugElement = fixture.debugElement;


		// set an invalid password
		component.createForm.patchValue({
			password: 'pas'
		});
		fixture.detectChanges();
		debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

		expect(component.createForm.valid).toBeFalse();
		expect(component.create.emit).not.toHaveBeenCalled();

	});

	it('should show an error if password is invalid', () => {

		const component = fixture.componentInstance;

		spyOn(component.createForm, 'markAsTouched');

		// get button
		const debugElement = fixture.debugElement;

		// set an invalid password
		component.createForm.patchValue({
			password: 'pass'
		});

		component.formStatus$ = of(false);

		// trigger emit
		debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

		fixture.detectChanges();

		const errorMessage = debugElement.query(By.css('tui-notification')).nativeElement;
		expect(errorMessage).toBeTruthy();
		expect(component.createForm.markAsTouched).toHaveBeenCalled();
	});

	it('should unsubscribe from observables', () => {

		const component = fixture.componentInstance;
		component.ngOnInit();
		fixture.detectChanges();

		component.ngOnDestroy();

		expect((component as any)._unsubscribeAll.observers.length).toBe(0);
	});





});
