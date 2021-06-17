import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChatMessage } from '@shared/models/message';
import { ChatService } from '@features/chat/services/chat/chat.service';
import { SocketConfig, SocketService } from '@shared/services/socket.service';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { ChatComponent } from './chat.component';
import SocketMock from 'socket.io-mock';
import { Visibility } from '@shared/services/room-config/room-config.service';
import { ChatModule } from './chat.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from '@shared/components/sidebar/sidebar.component';
import { EMPTY, of } from 'rxjs';
import { AckMessage } from '@shared/models/error';
import { LinkPreviewService } from '@shared/services/link-preview/link-preview.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LinkPreview, LinkPreviewResponse } from '@shared/models/linkPreview';
import { PreviewComponent } from '@shared/components/preview/preview.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '@shared/services/message/message.service';
import { TuiNotificationsService } from '@taiga-ui/core';
import { AudioService } from '@shared/services/audio/audio.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterModule } from '@angular/router';
import { ROUTES } from '../../app-routes';


const testConfig: SocketConfig = {
	socket: new SocketMock()
};


describe('Component: Chat', () => {
	let fixture: ComponentFixture<ChatComponent>;
	let component: ChatComponent;
	let chatService: ChatService;
	let messageService: MessageService;
	let socketService: SocketService;
	let linkPreviewService: LinkPreviewService;
	let tuiNotificationsService: TuiNotificationsService;
	let audioService: AudioService;
	const routerSpy = { navigate: jasmine.createSpy('navigate') };
	let spyStoredMessages;
	let spyDefaultAck;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [],
			providers: [
				ChatService,
				SocketService,
				LinkPreviewService,
				MessageService,
				TuiNotificationsService,
				AudioService,
				{ provide: Router, useValue: routerSpy },
				{ provide: TOKENAPI, useValue: environment.backendUrl },
				{ provide: 'SOCKETCONFIG', useValue: testConfig },
			],
			imports: [
				HttpClientTestingModule,
				ChatModule,
				BrowserAnimationsModule,
				ReactiveFormsModule,
				RouterTestingModule.withRoutes(ROUTES)
				//TuiNotificationModule
			]
		}).compileComponents();
		// init
		fixture = TestBed.createComponent(ChatComponent);
		component = fixture.componentInstance;
		chatService = TestBed.inject(ChatService);
		messageService = TestBed.inject(MessageService);
		socketService = TestBed.inject(SocketService);
		linkPreviewService = TestBed.inject(LinkPreviewService);
		tuiNotificationsService = TestBed.inject(TuiNotificationsService);
		audioService = TestBed.inject(AudioService);

		component.roomConfig = { name: 'room', visibility: Visibility.chat, room: { name: 'test', stickyMessages: [], private: false } };

		spyOn(socketService, 'listen').and.callFake(event => {
			if (event === 'connect') {
				return of(true);
			} else if (event === 'new-message') {
				return EMPTY;
			} else if (event === 'counter-update') {
				return of(1);
			} else if (event === 'active-users') {
				return of(['A', 'B', 'C']);
			} else if (event === 'disconnect') {
				return of(false);
			} else if (event === 'user-action') {
				return of({
					username: 'user test',
					action: 'leave-room',
					kickedUsername: 'user test 2'
				});
			} else if (event === 'new-sticky-message') {
				return of({
					content: 'test',
					room: 'test',
					username: 'pippo'
				});
			} else if (event === 'remove-sticky-message') {
				return EMPTY;
			} else if (event === 'kick-user') {
				return of('user test');
			}
		});

		spyOn(audioService, 'playSound').and.callFake(action => null);

		const ackMessage: AckMessage = {
			event: 'new-message',
			success: true
		};
		spyStoredMessages = spyOn(messageService, 'find').and.returnValue(of({ data: [] }));
		spyDefaultAck = spyOn(socketService, 'emit').and.returnValue(of(ackMessage));
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});

	it('should get old and new messages', ((done: DoneFn) => {
		// set data
		const message: ChatMessage = {
			_id: '53e85aa8d66a19ab846553b4f30660eb',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test'
		};

		// check correctness
		fixture.detectChanges();

		const expectedResults = [];

		component.messages$.subscribe(res => {
			expect(res).toEqual(expectedResults);
			expectedResults.push(message);
			done();
		});

		socketService.getSocket().socketClient.emit('new-message', message);
	}));

	it('should send a message', ((done: DoneFn) => {
		// set data
		component.roomConfig = {
			name: 'room',
			username: 'fellow oamer',
			visibility: Visibility.chat,
			room: { name: 'test', stickyMessages: [], private: false }
		};

		const message: ChatMessage = {
			_id: '123',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test',
			spoiler: false
		};

		const ackMessage: AckMessage = {
			event: 'new-message',
			success: true,
			data: message
		};
		const expectedMessages = [];

		spyDefaultAck.and.returnValue(of(ackMessage));

		fixture.detectChanges();

		component.messages$.subscribe(res => {
			expect(res).toEqual(expectedMessages);
			expectedMessages.push(message);
			done();
		});

		component.sendMessage(message);

	}));

	it('should correctly show sent and received message', () => {
		// set data
		const messageSent: ChatMessage = {
			_id: '7689',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test sent',
		};
		const messageReceived: ChatMessage = {
			_id: '456',
			username: 'fellow oamer friend',
			room: 'room',
			content: 'content test received'
		};

		const ackMessage: AckMessage = {
			event: 'new-message',
			success: true,
			data: messageSent
		};

		spyDefaultAck.and.returnValue(of(ackMessage));
		spyStoredMessages.and.returnValue(of({ data: [messageSent, messageReceived] }));

		component.roomConfig = {
			name: 'room',
			visibility: Visibility.chat,
			username: messageSent.username,
			room: { name: 'test', stickyMessages: [], private: false }
		};

		// check correctness
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		const messageSentElement = debugElement.query(By.css('.message.sent .message-content')).nativeElement;
		const messageReceivedElement = debugElement.query(By.css('.message.received .message-content')).nativeElement;
		expect(messageSentElement).toBeTruthy();
		expect(messageReceivedElement).toBeTruthy();

	});

	it('should show room name', (() => {
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		const roomNameElement = debugElement.query(By.css('.top-bar .room-name .name')).nativeElement;
		expect(roomNameElement).toBeTruthy();
	}));

	it('should show active users', (() => {
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		const numberOfPartecipantsElement = debugElement.query(By.css('app-active-users-list')).nativeElement;
		expect(numberOfPartecipantsElement).toBeTruthy();
	}));

	it('should hide spoiler message content', () => {
		// set data
		const message: ChatMessage = {
			_id: '21342',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test',
			spoiler: true
		};

		spyStoredMessages.and.returnValue(of({ data: [message] }));

		// check correctness
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const messageElement = debugElement.query(By.css('.message .message-content .spoiler-title')).nativeElement;
		const messageContent = messageElement.textContent.trim();
		expect(messageContent).toBe('Spoiler');

	});

	it('should show spoiler message content', () => {
		// set data
		const message: ChatMessage = {
			_id: '1443',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test',
			spoiler: true
		};
		spyStoredMessages.and.returnValue(of({ data: [message] }));

		// check correctness
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const btnShowSpoiler = debugElement.query(By.css('.message .spoiler-icon')).nativeElement;
		btnShowSpoiler.click();
		fixture.detectChanges();
		const messageElement = debugElement.query(By.css('.message .standard-message')).nativeElement;
		const messageContent = messageElement.textContent.trim();
		expect(messageContent).toBe(message.content);

	});

	/**
	 * Sidebar settings
	 */
	/* 	it('should open settings sidebar', () => {
			fixture.detectChanges();
			const debugElement = fixture.debugElement;
			const settingsIcon = debugElement.query(By.css('.top-bar .settings')).nativeElement;
			settingsIcon.click();
			const sidebar = debugElement.query(By.directive(SidebarComponent)).componentInstance as SidebarComponent;
			sidebar.status$.subscribe(status => {
				expect(status.open).toBe(true);
			});
		}); */

	it('should show static link preview in a message', () => {
		// set data
		const firstLinkPreview: LinkPreview = {
			url: 'www.test_url.test',
			title: 'test_title',
			description: 'test_description',
			image: 'test_image',
		};

		const message: ChatMessage = {
			_id: '1245',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test',
			spoiler: false,
			firstLinkPreview
		};

		spyStoredMessages.and.returnValue(of({ data: [message] }));

		// check correctness
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		const previewComponent = debugElement.query(By.directive(PreviewComponent));
		const previewElement = previewComponent.query(By.css('.preview-wrapper.static'));
		expect(previewElement).toBeTruthy();
	});

	it('should show users actions notification', () => {
		// set data
		component.roomConfig = {
			name: 'room',
			visibility: Visibility.chat,
			username: 'user test',
			room: { name: 'test', stickyMessages: [], private: false }
		};


		spyOn(tuiNotificationsService, 'show').and.callThrough();
		// check correctness
		fixture.detectChanges();
		expect(tuiNotificationsService.show).toHaveBeenCalled();
	});

	it('should convert string to Date type', () => {
		const date = new Date().toString();

		const dateObject = component.toDate(date);

		expect(dateObject).toBeInstanceOf(Date);
	});

	it('should return true if new day or false if not', () => {
		const message1: ChatMessage = {
			_id: '1245',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test',
			spoiler: false,
			sentDate: new Date()
		};
		const message2: ChatMessage = {
			_id: '5678',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test',
			spoiler: false,
			sentDate: new Date('11/02/2020')
		};
		const message3: ChatMessage = {
			_id: '9104',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test',
			spoiler: false,
			sentDate: new Date('11/02/2020')
		};

		expect(component.isNewDay(message1, message2)).toBe(true);
		expect(component.isNewDay(message2, message3)).toBe(false);
	});

	it('should show date badge', () => {
		const message: ChatMessage = {
			_id: '1245',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test',
			spoiler: false,
			sentDate: new Date()
		};

		spyStoredMessages.and.returnValue(of({ data: [message] }));

		// check correctness
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		const dateBadge = debugElement.query(By.css('.messages .badge-date')).nativeElement;
		expect(dateBadge.textContent.trim()).toBe('Today');
	});

	it('should redirect a kicked user', () => {
		// set data
		component.roomConfig = {
			name: 'room',
			username: 'fellow oamer',
			visibility: Visibility.chat,
			room: { name: 'room', stickyMessages: [], private: false }
		};
		component.ngOnInit();
		spyOn(chatService, 'getUserKick').and.returnValue(of('user test'));
		expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
	});

});
