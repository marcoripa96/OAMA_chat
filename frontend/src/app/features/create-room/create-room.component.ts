import { ChangeDetectionStrategy, Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { listAnimationFast, translateY } from '@shared/animations/animations';
import { CreateFormConfig } from '@shared/components/create-room-form/create-room-form.component';
import { InterceptorError } from '@shared/models/error';
import { Room } from '@shared/models/room';
import { LayoutService } from '@shared/services/layout/layout.service';
import { RoomConfigService, Visibility } from '@shared/services/room-config/room-config.service';
import { RoomService } from '@shared/services/room/room.service';
import { TuiNotification, TuiNotificationsService } from '@taiga-ui/core';
import { Observable } from 'rxjs';


/**
 * Provides the room creation page.
 */
@Component({
	selector: 'app-create-room',
	templateUrl: './create-room.component.html',
	styleUrls: ['./create-room.component.scss'],
	animations: [listAnimationFast, translateY],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoomComponent implements OnInit {
	// Room name
	@Input() roomName: string;

	// append animation to host element
	@HostBinding('@listAnimationFast') get enterAnimation(): boolean {
		return true;
	}

	// Form configuration for the CreateRoomFormComponent
	formConfig: CreateFormConfig = {
		name: { value: '', disabled: true, validators: [Validators.required] },
		private: { value: false, disabled: false, validators: [Validators.required] },
		password: { value: '', disabled: false, validators: [Validators.minLength(6)] },
		persistent: {value: false, disabled: false, validators: [Validators.required] },
		description: {value: '', disabled: false, validators: [Validators.maxLength(90)]}
	};

	// Emits a value on start and end of an HTTP call
	loading$: Observable<boolean>;

	constructor(
		private _roomService: RoomService,
		private _roomConfigService: RoomConfigService,
		private _layoutService: LayoutService,
		@Inject(TuiNotificationsService) private readonly _notificationsService: TuiNotificationsService
	) {
		this._layoutService.set({
			toolbar: 'center'
		});
	}

	ngOnInit() {
		this.formConfig.name.value = this.roomName;
	}

	/**
	 * Creates a room on form submit.
	 */
	createRoom(room: Room): void {
		this._roomService.create(room).subscribe(res => {
			this._roomConfigService.set({ visibility: Visibility.username, room: res.data[0] });
		}, (error: InterceptorError) => {
			// show error notification
			this._notificationsService.show(error.resMessage, { label: error.errorMessage, status: TuiNotification.Error })
				.subscribe();
		});
	}

	toUpper(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}



}
