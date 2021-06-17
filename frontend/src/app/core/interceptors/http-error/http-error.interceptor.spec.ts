import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Room, RoomResponse } from '@shared/models/room';

import { RoomService } from '@shared/services/room/room.service';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { HttpErrorInterceptor } from './http-error.interceptors';



describe('HttpErrorInterceptor', () => {
	let httpMock: HttpTestingController;
	let roomService: RoomService;
	let token: string;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			],
			declarations: [
			],
			providers: [
				RoomService,
				{
					provide: HTTP_INTERCEPTORS,
					useClass: HttpErrorInterceptor,
					multi: true,
				},
				{ provide: TOKENAPI, useValue: environment.backendUrl }
			]
		}).compileComponents();

		roomService = TestBed.inject(RoomService);
		token = TestBed.inject(TOKENAPI);
    	httpMock = TestBed.inject(HttpTestingController);
	});

	it('should handle http error', () => {
		const room: Room = {
			name: 'room',
			private: false,
			stickyMessages: []
		};

		const mockErrorResponse = { status: 409, statusText: 'Conflict' };
		const expectedMessage = `Error Code: ${mockErrorResponse.status} - ${mockErrorResponse.statusText}`;

		roomService.create(room).subscribe(
			() => {},
			(err) => expect(err.errorMessage).toBe(expectedMessage)
		);

		const req = httpMock.expectOne(`${token}/api/room`);

		req.flush('error', mockErrorResponse);
	});

	afterAll(() => {
		TestBed.resetTestingModule();
	});


});
