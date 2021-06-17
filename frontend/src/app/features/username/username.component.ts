import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { enterAnimation, shakeAnimation } from '@shared/animations/animations';
import { LayoutService } from '@shared/services/layout/layout.service';
import { LoaderService } from '@shared/services/loader/loader.service';
import { RoomConfig, RoomConfigService, Visibility } from '@shared/services/room-config/room-config.service';
import { RoomService } from '@shared/services/room/room.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-username',
	templateUrl: './username.component.html',
	styleUrls: ['./username.component.scss'],
	animations: [
		enterAnimation,
		shakeAnimation
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsernameComponent implements OnInit {


	// Default username
	private _defaultName = 'Fellow Oamer';

	// Form group
	userForm: FormGroup;

	// Variables to keep track of animations triggers
	authError: boolean;
	animateShake: boolean;

	// Emits a value on start and end of an HTTP call
	loading$: Observable<boolean>;

	// Current room configuration
	private _roomConfig: RoomConfig;
	// Getter for private variable
	get roomConfig(): RoomConfig {
		return this._roomConfig;
	}
	// Setter on input to create the form
	@Input() set roomConfig(config: RoomConfig) {
		if (config && this._roomConfig !== config) {
			this._roomConfig = config;
			this.userForm = this._createForm(config);
		}
	}

	// Getter for username value
	get username(): string {
		return this.userForm.value.username;
	}

	constructor(
		private readonly _layoutService: LayoutService,
		private readonly _roomConfigService: RoomConfigService,
		private readonly  _roomService: RoomService,
		private readonly _cdr: ChangeDetectorRef,
		private readonly _loaderService: LoaderService,
		@Inject(LOCAL_STORAGE) private readonly _localStorage: Storage,
	) {
		// set layout configuration
		this._layoutService.set({
			toolbar: 'center'
		});
	}

	ngOnInit() {
		// set loading observable
		this.loading$ = this._loaderService.loading$;
	}

	/**
	 * Access a room if form is valid
	 */
	enterRoom(): void {
		if (this.userForm.valid) {
			this._roomService.access(this._roomConfig.room.name, this.userForm.value.password).subscribe(() => {
				// if access is successfull set username in local storage
				this._localStorage.setItem(this.roomConfig.name, this.userForm.value.username);
				// change room configuration to display chat component
				this._roomConfigService.set({
					visibility: Visibility.chat,
					username: this.username
				});
			},
			(error) => {
				// trigger animations and errors
				this.authError = true;
				this.animateShake = true;
				this._cdr.markForCheck();
			});
		}

	}

	/**
	 * Event triggered when focus changes on the username input
	 */
	onFocusChange(focus: boolean): void {
		if (focus && this.username === this._defaultName) {
			this.userForm.patchValue({
				username: ''
			});
		} else {
			if (this.username === '') {
				this.userForm.patchValue({
					username: this._defaultName
				});
			}
		}
	}

	/**
	 * Reset shake animation when it is done
	 */
	onShakeDone(): void {
		this.animateShake = false;
	}

	toUpper(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/**
	 * Create form
	 */
	private _createForm(roomConfig: RoomConfig): FormGroup {
		const username = this._localStorage.getItem(this.roomConfig.name);
		if (username) {
			this._defaultName = username;
		}
		const formGroup = new FormGroup({
			username: new FormControl(this._defaultName, [Validators.required])
		});
		if(roomConfig.room.private) {
			formGroup.addControl('password', new FormControl('', [Validators.required]));
		}
		return formGroup;
	}
}
