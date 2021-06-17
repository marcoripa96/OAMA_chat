import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from '@features/chat/chat.component';
import { ChatModule } from '@features/chat/chat.module';
import { ChatMessageResponse } from '@shared/models/message';
import { ChatService } from '@features/chat/services/chat/chat.service';
import { Visibility } from '@shared/services/room-config/room-config.service';
import { SidebarService, SidebarStatus } from '@shared/services/sidebar/sidebar.service';
import { TOKENAPI } from '@shared/tokens/token-api';
import { TuiRadioBlockComponent } from '@taiga-ui/kit';
import { environment } from 'environments/environment';
import { of, throwError } from 'rxjs';
import { SearchComponent } from './search.component';
import { SearchModule } from './search.module';
import { MessageService } from '@shared/services/message/message.service';
import { ROUTES } from 'app/app-routes';
import { RouterTestingModule } from '@angular/router/testing';


describe('SearchComponent', () => {
	let fixture: ComponentFixture<SearchComponent>;
	let sidebarService: SidebarService;
	let chatService: ChatService;
	let messageService: MessageService;
	let chatComponent: ChatComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				BrowserAnimationsModule,
				HttpClientTestingModule,
				SearchModule,
				ChatModule,
				RouterTestingModule.withRoutes(ROUTES)
			],
			declarations: [],
			providers: [
				SidebarService,
				ChatService,
				{ provide: TOKENAPI, useValue: environment.backendUrl },
				{ provide: ChatComponent, useClass: ChatComponent}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(SearchComponent);
		// fixtureChat = TestBed.createComponent(ChatComponent);
		sidebarService = TestBed.inject(SidebarService);
		chatService = TestBed.inject(ChatService);
		messageService = TestBed.inject(MessageService);
		chatComponent = TestBed.inject(ChatComponent);

		chatComponent.roomConfig = {
			name: 'room',
			username: 'fellow oamer',
			visibility: Visibility.chat
		};
	});

	// check if component gets instantiated
	it('should create the component', () => {
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should create the search form', () => {
		const component = fixture.componentInstance;
		fixture.detectChanges();
		expect(component.searchForm.value).toEqual({ search: '', filter: 'all' });
	});

	it('should get messages after loading', fakeAsync(() => {
		const component = fixture.componentInstance;

		const resMessages: ChatMessageResponse = {
			data: [
				{
					room: chatComponent.roomConfig.name,
					username: 'user1',
					content: 'hello'
				},
				{
					room: chatComponent.roomConfig.name,
					username: 'user2',
					content: 'hello 2'
				}
			]
		};

		spyOn(messageService, 'find').and.returnValue(of(resMessages));
		fixture.detectChanges();

		const expectedValues = ['EMPTY', 'LOADING', resMessages.data];
		let index = 0;

		component.messages$.subscribe(res => {
			expect(res).toEqual(expectedValues[index]);
			index++;
		});

		component.searchForm.patchValue({
			search: 'test',
		});

		tick(300);

	}));

	it('should get messages after changing filters', fakeAsync(() => {
		const component = fixture.componentInstance;

		const resMessages: ChatMessageResponse = {
			data: [
				{
					room: chatComponent.roomConfig.name,
					username: 'user1',
					content: 'hello'
				},
				{
					room: chatComponent.roomConfig.name,
					username: 'user2',
					content: 'hello 2'
				}
			]
		};

		spyOn(messageService, 'find').and.returnValue(of(resMessages));
		fixture.detectChanges();

		const expectedValues = ['EMPTY', 'LOADING', resMessages.data, 'LOADING', resMessages.data];
		let index = 0;

		component.messages$.subscribe(res => {
			expect(res).toEqual(expectedValues[index]);
			index++;
		});

		component.searchForm.patchValue({
			search: 'test',
		});
		tick(300);

		component.searchForm.patchValue({
			filter: 'links'
		});
		tick(300);
	}));

	it('should get EMPTY after error', fakeAsync(() => {
		const component = fixture.componentInstance;

		spyOn(chatService, 'searchMessage').and.returnValue(throwError('error'));
		fixture.detectChanges();

		const expectedValues = ['EMPTY', 'LOADING', 'EMPTY'];
		let index = 0;

		component.messages$.subscribe(res => {
			expect(res).toEqual(expectedValues[index]);
			index++;
		});

		component.searchForm.patchValue({
			search: 'test',
		});

		tick(300);
	}));

	it('should close sidebar on arrow click', (done: DoneFn) => {
		fixture.detectChanges();

		const expectedValues = [false, true, false];
		let index = 0;

		sidebarService.status$.subscribe(status => {
			expect(status.open).toBe(expectedValues[index]);
			index++;
			done();
		});

		const arrowIcon = fixture.debugElement.query(By.css('#close-arrow')).nativeElement;

		sidebarService.show(null);
		arrowIcon.dispatchEvent(new Event('click'));
	});


	it('should close sidebar on message click', fakeAsync(() => {
		const component = fixture.componentInstance;

		const resMessages: ChatMessageResponse = {
			data: [
				{
					room: chatComponent.roomConfig.name,
					username: 'user1',
					content: 'hello'
				},
				{
					room: chatComponent.roomConfig.name,
					username: 'user2',
					content: 'hello 2'
				}
			]
		};

		spyOn(messageService, 'find').and.returnValue(of(resMessages));
		fixture.detectChanges();

		const expectedValues = ['EMPTY', 'LOADING', resMessages.data];
		let index = 0;

		component.messages$.subscribe(res => {
			fixture.detectChanges();
			expect(res).toEqual(expectedValues[index]);
			index++;
		});

		component.searchForm.patchValue({
			search: 'test',
		});

		tick(300);

		const expectedSidebarStatuses: SidebarStatus[] = [
			{
				open: false
			},
			{
				open: true,
				content: null
			},
			{
				open: false,
				data: {
					from: 'search',
					value: resMessages.data[0]
				}
			}
		];
		let indexStatuses = 0;

		sidebarService.status$.subscribe(status => {
			expect(status).toEqual(expectedSidebarStatuses[indexStatuses]);
			indexStatuses++;
		});

		const messageElements = fixture.debugElement.queryAll(By.css('.message'));
		expect(messageElements.length).toBe(resMessages.data.length);

		const messageElement = messageElements[0].nativeElement;

		sidebarService.show(null);
		messageElement.dispatchEvent(new Event('click'));

	}));



});
