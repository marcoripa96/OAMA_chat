import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { RoomConfig, RoomConfigService, Visibility } from './room-config.service';
import { RoomService } from '../room/room.service';
import { TestScheduler } from 'rxjs/testing';
import { Room, RoomResponse } from '@shared/models/room';
import { of, throwError } from 'rxjs';

describe('Service: RoomConfig', () => {
	let service: RoomConfigService;
	let roomService: RoomService;
	let testScheduler: TestScheduler;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				RoomConfigService,
				RoomService,
				{ provide: TOKENAPI, useValue: environment.backendUrl }
			]
		});

		// get components
		service = TestBed.inject(RoomConfigService);
		roomService = TestBed.inject(RoomService);
		testScheduler = new TestScheduler((actual, expected) => {
			expect(actual).toEqual(expected);
		});
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should get a username config', fakeAsync(() => {

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

		const expectedUsernameConfig: RoomConfig = {
			visibility: Visibility.username,
			name: room.name,
			room
		};

		service.config$.subscribe(config => {
			expect(config).toEqual(expectedUsernameConfig);
		});

		// spy on the subscription inside init function
		spyOn(roomService, 'findOne').and.returnValue(of(response));
		service.init(room.name);

	}));

	it('should get a create config', fakeAsync(() => {

		const room: Room = {
			_id: '1',
			name: 'roomName',
			private: false,
			stickyMessages: []
		};

		const expectedCreateConfig: RoomConfig = {
			visibility: Visibility.create,
			name: room.name
		};

		service.config$.subscribe(config => {
			expect(config).toEqual(expectedCreateConfig);
		});

		// spy on the subscription inside init function
		spyOn(roomService, 'findOne').and.returnValue(throwError({status: 404}));
		service.init(room.name);
	}));

	it('should set a new config and emit it', fakeAsync(() => {

		const config: RoomConfig = {
			visibility: Visibility.create,
			name: 'newRoom'
		};

		testScheduler.run(({expectObservable, cold}) => {
			const expectedConfigs = {a: config};
			cold('-a').subscribe(() => {service.set(config);});

			expectObservable(service.config$).toBe('-a', expectedConfigs);
		});
	}));

});
