/* tslint:disable:no-unused-variable */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { ChatMessage, ChatMessageResponse } from '@shared/models/message';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { MessageService } from './message.service';

describe('MessageService', () => {
	let service: MessageService;
	let token: string;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				MessageService,
				{ provide: TOKENAPI, useValue: environment.backendUrl }
			]
		});

		// get components
		service = TestBed.inject(MessageService);
		token = TestBed.inject(TOKENAPI);
		httpMock = TestBed.inject(HttpTestingController);
	});

	// test if service gets instantiated
	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should create a new message', () => {
		const message: ChatMessage = {
			_id: '53e85aa8d66a19ab846553b4f30660eb',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test'
		};
		// create mock response
		const response: ChatMessageResponse = {
			data: [message],
			message: 'message created'
		};

		// fake request with test function of service
		service.create(message).subscribe(res => {
			// check if response is equal to fake response
			expect(res).toEqual(response);
		});

		// check if request is directed to the right endpoint
		const req = httpMock.expectOne(token + '/api/message');

		// check if request is a POST request
		expect(req.request.method).toEqual('POST');

		// resolve request with fake response
		req.flush(response);

		// verify no other requests are on hold
		httpMock.verify();
	});

	it('should get a message by id', () => {
		const message: ChatMessage = {
			_id: '53e85aa8d66a19ab846553b4f30660eb',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test'
		};

		const response: ChatMessageResponse = {
			data: [message],
			message: 'message found'
		};

		service.findOne(message._id).subscribe(res => {
			expect(res).toEqual(response);
		});

		const req = httpMock.expectOne(`${token}/api/message/${message._id}`);
		expect(req.request.method).toEqual('GET');

		req.flush(response);
		httpMock.verify();
	});

	it('should get all messages of a room', () => {

		const message1: ChatMessage = {
			_id: '123',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test'
		};
		const message2: ChatMessage = {
			_id: '456',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test'
		};

		const response: ChatMessageResponse = {
			data: [message1, message2],
			message: 'all room messages'
		};

		service.find(message1.room).subscribe(res => {
			expect(res).toEqual(response);
		});

		const req = httpMock.expectOne(`${token}/api/message?roomId=${message1.room}`);
		expect(req.request.method).toEqual('GET');

		req.flush(response);
		httpMock.verify();
	});

	it('should get all messages with content and filter', () => {

		const message1: ChatMessage = {
			_id: '123',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test'
		};
		const message2: ChatMessage = {
			_id: '456',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test'
		};

		const response: ChatMessageResponse = {
			data: [message1, message2],
			message: 'all room messages'
		};

		service.find(message1.room, 'content', 'all').subscribe(res => {
			expect(res).toEqual(response);
		});

		const req = httpMock.expectOne(`${token}/api/message?roomId=${message1.room}&content=content&filter=all`);
		expect(req.request.method).toEqual('GET');

		req.flush(response);
		httpMock.verify();
	});

	it('should update a message by id', () => {

		const message: ChatMessage = {
			_id: '123',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test'
		};

		const newMessage: ChatMessage = {
			_id: '123',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test new'
		};

		const response: ChatMessageResponse = {
			data: [newMessage],
			message: 'message updated'
		};

		service.update(newMessage).subscribe(res => {
			expect(res).toEqual(response);
		});

		const req = httpMock.expectOne(`${token}/api/message/${newMessage._id}`);
		expect(req.request.method).toEqual('PUT');

		req.flush(response);
		httpMock.verify();
	});

	it('should delete a message by id', () => {

		const message: ChatMessage = {
			_id: '123',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test'
		};

		const response: ChatMessageResponse = {
			message: 'message deleted'
		};

		service.delete(message).subscribe(res => {
			expect(res).toEqual(response);
		});

		const req = httpMock.expectOne(`${token}/api/message/${message._id}`);
		expect(req.request.method).toEqual('DELETE');

		req.flush(response);

		httpMock.verify();
	});
});
