/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';
import { environment } from 'environments/environment';
import { TOKENAPI } from '@shared/tokens/token-api';
import { SocketConfig, SocketService } from '../../../../shared/services/socket.service';
import SocketMock from 'socket.io-mock';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatMessage } from '@shared/models/message';
import { MessageService } from '@shared/services/message/message.service';
import { of } from 'rxjs';



const testConfig: SocketConfig = {
	socket: new SocketMock()
};


describe('ChatService', () => {

	let service: ChatService;
	let socketService: SocketService;
	let messageService: MessageService;
	let httpMock: HttpTestingController;
	let token: string;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ChatService,
				SocketService,
				MessageService,
				{ provide: TOKENAPI, useValue: environment.backendUrl },
				{ provide: 'SOCKETCONFIG', useValue: testConfig }
			],
			imports: [HttpClientTestingModule]
		});
		// init
		service = TestBed.inject(ChatService);
		socketService = TestBed.inject(SocketService);
		messageService = TestBed.inject(MessageService);
		httpMock = TestBed.inject(HttpTestingController);
		token = TestBed.inject(TOKENAPI);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should emit stored and new messages', ((done: DoneFn) => {
		const storedMessage: ChatMessage = {
			_id: '53e85aa8d66a19ab846553b4f30660ea',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test stored'
		};


		spyOn(messageService, 'find').and.returnValue(of({data: [storedMessage]}));

		// set data
		const message: ChatMessage = {
			_id: '53e85aa8d66a19ab846553b4f30660eb',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test'
		};

		const expectedResults = [storedMessage];


		service.getMessages(message.room).subscribe(res => {
			expect(res).toEqual(expectedResults);
			expectedResults.push(message);
			done();
		});

		socketService.getSocket().socketClient.emit('new-message', message);
	}));

	// TODO: emit events from the mocked server socket...
});
