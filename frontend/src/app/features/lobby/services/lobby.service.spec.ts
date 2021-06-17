import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { RoomService } from '@shared/services/room/room.service';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { LobbyService } from './lobby.service';

describe('LobbyService', () => {
	let lobbyService: LobbyService;
	let roomService: RoomService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				RoomService,
				{ provide: TOKENAPI, useValue: environment.backendUrl }
			]
		});

		// get components
		lobbyService = TestBed.inject(LobbyService);
		roomService = TestBed.inject(RoomService);
	});

	it('should be created', () => {
		expect(lobbyService).toBeTruthy();
	});

	it('should get initial form', () => {
		const form = lobbyService.getForm();
		expect(form).toBeTruthy();
		expect(form).toBeInstanceOf(FormGroup);
	});

	it('should get rooms', fakeAsync(() => {
		const expectedRes = {
			data: [
				{
					name: 'room 1',
					description: 'description test 1',
					private: false,
					stickyMessages: []
				}
			],
			more: true
		};

		spyOn(roomService, 'find').and.returnValue(of(expectedRes));
		lobbyService.getRooms().subscribe(res => {
			expect(res).toEqual(expectedRes);
		});

		tick(250);
	}));

	it('should get query form field', () => {
		const query = lobbyService.query;
		expect(query.value).toBe('');
	});

});
