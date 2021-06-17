import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { ChatComponent } from '@features/chat/chat.component';
import { ChatModule } from '@features/chat/chat.module';
import { CreateRoomComponent } from '@features/create-room/create-room.component';
import { CreateRoomModule } from '@features/create-room/create-room.module';
import { UsernameComponent } from '@features/username/username.component';
import { UsernameModule } from '@features/username/username.module';
import { BlobModule } from '@shared/components/blob/blob.module';
import { Room, RoomResponse } from '@shared/models/room';
import { RoomConfig, RoomConfigService, Visibility } from '@shared/services/room-config/room-config.service';
import { RoomService } from '@shared/services/room/room.service';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { RoomComponent } from './room.component';


describe('RoomComponent', () => {

	let fixture: ComponentFixture<RoomComponent>;
	let roomConfigService: RoomConfigService;
	let roomService: RoomService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				BrowserAnimationsModule,
				CreateRoomModule,
				BlobModule,
				UsernameModule,
				ChatModule
			],
			declarations: [
				RoomComponent
			],
			providers: [
				RoomConfigService,
				RoomService,
				{ provide: TOKENAPI, useValue: environment.backendUrl },
				{
					provide: ActivatedRoute,
					useValue: {
						params: of({ room: 'roomName' })
					},
				},
			]
		}).compileComponents();

		fixture = TestBed.createComponent(RoomComponent);
		roomConfigService = TestBed.inject(RoomConfigService);
		roomService = TestBed.inject(RoomService);
	});

	// check if component gets instantiated
	it('should create the component', () => {
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});


	it('should get room config given room name', fakeAsync(() => {
		const component = fixture.componentInstance;
		const room: Room = {
			_id: '1',
			name: 'roomName',
			private: false,
			stickyMessages: []
		};
		const response: RoomResponse = {
			data: [room],
			message: 'room found'
		};
		const roomConfig: RoomConfig = {
			visibility: Visibility.username,
			name: room.name,
			room
		};

		spyOn(roomService, 'findOne').and.returnValue(of(response));
		component.ngOnInit();

		component.roomConfig$.subscribe(config => expect(config).toEqual(roomConfig));
		fixture.detectChanges();

	}));

	it('should show create component', () => {
		const component = fixture.componentInstance;
		const debugElement = fixture.debugElement;
		// trigger on init
		fixture.detectChanges();

		const roomConfig: RoomConfig = {
			visibility: Visibility.create,
			name: 'hello',
		};
		// mock observable value and trigger changes
		component.roomConfig$ = of(roomConfig);
		fixture.detectChanges();

		const createComponent = debugElement.query(By.directive(CreateRoomComponent)).nativeElement;
		expect(createComponent).toBeTruthy();
	});

	it('should show username component', () => {
		const component = fixture.componentInstance;
		const debugElement = fixture.debugElement;
		// trigger on init
		fixture.detectChanges();

		const roomConfig: RoomConfig = {
			visibility: Visibility.username,
			name: 'room',
			room: {
				name: 'room',
				private: false,
				stickyMessages: []
			}
		};
		// mock observable value and trigger changes
		component.roomConfig$ = of(roomConfig);
		fixture.detectChanges();

		const usernameComponent = debugElement.query(By.directive(UsernameComponent)).nativeElement;
		expect(usernameComponent).toBeTruthy();
	});

});
