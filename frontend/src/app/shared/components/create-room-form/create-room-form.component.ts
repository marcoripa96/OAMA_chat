/* eslint-disable @typescript-eslint/dot-notation */
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { enterAnimation, shakeAnimation } from '@shared/animations/animations';
import { Room } from '@shared/models/room';
import { LoaderService } from '@shared/services/loader/loader.service';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';

interface Control {
	value: string | boolean;
	disabled: boolean;
	validators?: Validators[];
}

export interface CreateFormConfig {
	name: Control;
	private: Control;
	password: Control;
	persistent: Control;
	description: Control;
	// add other options
}

/**
 * Provides a form component to create a Room.
 */
@Component({
	selector: 'app-create-room-form',
	templateUrl: './create-room-form.component.html',
	styleUrls: ['./create-room-form.component.scss'],
	animations: [
		enterAnimation,
		shakeAnimation
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoomFormComponent implements OnInit, OnDestroy {

	// A CreateFormConfig to setup the form
	@Input() formConfig: CreateFormConfig;

	// Event emitter on form submit
	@Output() create: EventEmitter<Room> = new EventEmitter();

	// Form group
	createForm: FormGroup = new FormGroup({});

	// Emits a value everytime the validity of the password changes
	validPassword$: Observable<boolean>;

	// Emits a value everytime the validity of the form changes
	formStatus$: Observable<boolean>;

	// Keeps track of the shake animation trigger
	animateShake: boolean;

	// Emits a value on start and end of an HTTP call
	loading$: Observable<boolean>;

	private _unsubscribeAll = new Subject<void>();

	/**
	 * Getter to password control
	 */
	get passwordControl(): FormControl {
		return this.createForm.get('password') as FormControl;
	}

	/**
	 * Getter to validation event
	 */
	get validating(): any {
		const _validator: any = this.passwordControl.validator && this.passwordControl.validator(this.passwordControl);
		return _validator && _validator.minlength;
	}

	constructor(private _loaderService: LoaderService) { }

	ngOnInit() {
		// create form
		this._createForm();
		// get loading state from service
		this.loading$ = this._loaderService.loading$;

		// set validPassword observable
		this.validPassword$ = this.passwordControl.valueChanges
			.pipe(
				map(() => this._isValidPassword()),
				distinctUntilChanged(),
				takeUntil(this._unsubscribeAll)
			);

		// set form status observable
		this.formStatus$ = this.createForm.statusChanges
			.pipe(
				startWith('VALID'),
				map(status => status === 'VALID' ? true : false),
				distinctUntilChanged(),
				takeUntil(this._unsubscribeAll)
			);
	}

	ngOnDestroy() {
		// unsubscribe from all observables
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}

	/**
	 * Emits the form values if form is valid.
	 */
	submitForm(): void {
		if (this.createForm.valid) {
			this.create.emit(this._getFormValue());
		} else {
			this.createForm.markAsTouched();
			this.animateShake = true;
		}
	}

	/**
	 * Resets shake animation on animation done
	 */
	onShakeDone(): void {
		this.animateShake = false;
	}


	/**
	 * Creates a form based on the CreateFormConfig given as component's @input()
	 */
	private _createForm(): void {
		Object.keys(this.formConfig).forEach(key => {
			const value = this.formConfig[key].value;
			const disabled = this.formConfig[key].disabled;
			const validators = this.formConfig[key].validators;
			this.createForm.addControl(key, new FormControl({ value, disabled }, validators));
		});
	}

	/**
	 * Checks the validity of the password
	 */
	private _isValidPassword(): boolean {
		const _validator: any = this.passwordControl.validator && this.passwordControl.validator(this.passwordControl);
		const validating = _validator && _validator.minlength;
		return this.passwordControl.value.length > 0 && !validating;
	}

	/**
	 * Get form value
	 */
	private _getFormValue(): Room {
		const room: Room = this.createForm.getRawValue();
		// if a password is present change the room to private
		if (room.password.length > 0) {
			room.private = true;
		}
		return room;
	}

}
