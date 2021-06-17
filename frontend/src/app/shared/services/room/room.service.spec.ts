/* tslint:disable:no-unused-variable */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Room, RoomResponse } from '@shared/models/room';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { RoomService } from './room.service';

describe('Service: Room', () => {
	let service: RoomService;
	let token: string;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				RoomService,
				{ provide: TOKENAPI, useValue: environment.backendUrl }
			]
		});

		// get components
		service = TestBed.inject(RoomService);
		token = TestBed.inject(TOKENAPI);
		httpMock = TestBed.inject(HttpTestingController);
	});

	// test if service gets instantiated
	it('should be created', () => {
		expect(service).toBeTruthy();
	});


	it('should create a new room', () => {
		const room: Room = {
			name: 'newroom',
			private: false,
			stickyMessages: []
		};
		// create mock response
		const response: RoomResponse = {
			data: [{
				_id: '1',
				name: room.name,
				private: false,
				stickyMessages: []
			}],
			message: 'room created'
		};

		// fake request with test function of service
		service.create(room).subscribe(res => {
			// check if response is equal to fake response
			expect(res).toEqual(response);
		});

		// check if request is directed to '/api/rooms'
		const req = httpMock.expectOne(token + '/api/room');

		// check if request is a POST request
		expect(req.request.method).toEqual('POST');

		// resolve request with fake response
		req.flush(response);

		// verify no other requests are on hold
		httpMock.verify();
	});

	it('should get a room by name', () => {
		const roomName = 'room';

		const response: RoomResponse = {
			data: [{
				_id: '1',
				name: roomName,
				private: false,
				stickyMessages: []
			}],
			message: 'room found'
		};

		service.findOne(roomName).subscribe(res => {
			expect(res).toEqual(response);
		});

		const req = httpMock.expectOne(`${token}/api/room/${roomName}`);
		expect(req.request.method).toEqual('GET');

		req.flush(response);
		httpMock.verify();
	});

	it('should get page 0 of rooms with specified parameters', () => {

		const response: RoomResponse = {
			data: [
				{
					_id: '1',
					name: 'name1',
					private: false,
					stickyMessages: []
				},
				{
					_id: '2',
					name: 'name2',
					private: false,
					stickyMessages: []
				}
			],
			message: 'all rooms',
			more: true
		};

		service.find({pagination: {page: 0}}).subscribe(res => {
			expect(res).toEqual(response);
		});

		const req = httpMock.expectOne(`${token}/api/room?page=0`);
		expect(req.request.method).toEqual('GET');

		req.flush(response);
		httpMock.verify();
	});

	it('should update a room by id', () => {

		const newRoom: Room = {
			_id: '1',
			name: 'newName',
			private: false,
			stickyMessages: []
		};

		const response: RoomResponse = {
			data: [newRoom],
			message: 'room updated'
		};

		service.update(newRoom).subscribe(res => {
			expect(res).toEqual(response);
		});

		const req = httpMock.expectOne(`${token}/api/room/${newRoom._id}`);
		expect(req.request.method).toEqual('PUT');

		req.flush(response);
		httpMock.verify();
	});

	it('should delete a room by id', () => {

		const roomToDelete: Room = {
			_id: '1',
			name: 'roomToBeDeleted',
			private: false,
			stickyMessages: []
		};

		const response: RoomResponse = {
			data: [],
			message: 'room deleted'
		};

		service.delete(roomToDelete).subscribe(res => {
			expect(res).toEqual(response);
		});

		const req = httpMock.expectOne(`${token}/api/room/${roomToDelete._id}`);
		expect(req.request.method).toEqual('DELETE');

		req.flush(response);

		httpMock.verify();
	});

	it('should encrypt a password', () => {
		const password = 'pass';

		const serviceProto = Object.getPrototypeOf(service);
		const hash = serviceProto._encrypt(password);

		expect(hash).not.toEqual('');
	});

	it('should access a room without a password', () => {
		const room: Room = {
			_id: '1',
			name: 'room',
			private: false,
			stickyMessages: []
		};

		const response: RoomResponse = {
			data: [],
			message: 'Authentication succeded'
		};

		service.access(room.name, '').subscribe(res => {
			expect(res).toEqual(response);
		});

		const req = httpMock.expectOne(`${token}/api/room/access`);
		expect(req.request.method).toEqual('POST');

		req.flush(response);

		httpMock.verify();
	});

	it('should access a room with a password', () => {
		const room: Room = {
			_id: '1',
			name: 'room',
			private: true,
			password: 'pass',
			stickyMessages: []
		};

		const response: RoomResponse = {
			data: [],
			message: 'Authentication succeded'
		};

		service.access(room.name, '').subscribe(res => {
			expect(res).toEqual(response);
		});

		const req = httpMock.expectOne(`${token}/api/room/access`);
		expect(req.request.method).toEqual('POST');

		req.flush(response);

		httpMock.verify();
	});


});
