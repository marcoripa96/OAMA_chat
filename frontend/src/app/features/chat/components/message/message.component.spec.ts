import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChatMessage } from '@shared/models/message';
import { SocketConfig } from '@shared/services/socket.service';

import SocketMock from 'socket.io-mock';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageModule } from './message.module';
import { MessageComponent } from './message.component';

const testConfig: SocketConfig = {
	socket: new SocketMock()
};


describe('MessageComponent', () => {
	let fixture: ComponentFixture<MessageComponent>;
	let component: MessageComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [],
			providers: [
			],
			imports: [
				BrowserAnimationsModule,
				MessageModule
			]
		}).compileComponents();
		// init
		fixture = TestBed.createComponent(MessageComponent);
		component = fixture.componentInstance;

		const message: ChatMessage = {
			room: 'roomTest',
			username: 'userTest',
			content: 'content test',
			spoiler: false
		};

		component.message =  message;
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});

	it('should show the avatar', () => {
		component.showAvatar = true;
		fixture.detectChanges();
		const avatar = fixture.debugElement.query(By.css('tui-avatar'));
		expect(avatar).toBeTruthy();
	});

	it('should not show the avatar', () => {
		component.showAvatar = false;
		fixture.detectChanges();
		const avatar = fixture.debugElement.query(By.css('tui-avatar'));
		expect(avatar).toBeFalsy();
	});

	it('should apply the sent class', () => {
		component.type = 'sent';
		fixture.detectChanges();
		const elementClasses = fixture.debugElement.query(By.css('.message')).classes;
		expect(elementClasses.sent).toBe(true);
	});

	it('should apply the received class', () => {
		component.type = 'received';
		fixture.detectChanges();
		const elementClasses = fixture.debugElement.query(By.css('.message')).classes;
		expect(elementClasses.received).toBe(true);
	});

	it('should apply the first class', () => {
		component.showAvatar = true;
		fixture.detectChanges();
		const elementClasses = fixture.debugElement.query(By.css('.message')).classes;
		expect(elementClasses.first).toBe(true);
	});

	it('should apply the second class', () => {
		component.showAvatar = false;
		fixture.detectChanges();
		const elementClasses = fixture.debugElement.query(By.css('.message')).classes;
		expect(elementClasses.second).toBe(true);
	});


	it('should show the username', () => {
		component.showUsername = true;
		fixture.detectChanges();
		const username = fixture.debugElement.query(By.css('.username'));
		expect(username).toBeTruthy();
	});

	it('should show a spoiler', () => {
		component.message.spoiler = true;
		fixture.detectChanges();
		const spoilerContent = fixture.debugElement.query(By.css('.spoiler-content'));
		expect(spoilerContent).toBeTruthy();

		const standardContent = fixture.debugElement.query(By.css('.standard-message'));
		expect(standardContent).toBeFalsy();
	});

	it('should show a standard message', () => {
		component.message.spoiler = false;
		fixture.detectChanges();
		const spoilerContent = fixture.debugElement.query(By.css('.spoiler-content'));
		expect(spoilerContent).toBeFalsy();

		const standardContent = fixture.debugElement.query(By.css('.standard-message'));
		expect(standardContent).toBeTruthy();

		expect(standardContent.nativeElement.innerText).toBe(component.message.content);
	});

	it('should show a preview', () => {
		component.message.firstLinkPreview = {title: 'preview link title'};
		component.message.spoiler = false;
		fixture.detectChanges();

		const standardContent = fixture.debugElement.query(By.css('app-preview'));

		expect(standardContent).toBeTruthy();
	});

	it('should toggle spoiler visibility', () => {
		component.message.spoiler = true;
		fixture.detectChanges();

		const spoilerContent = fixture.debugElement.query(By.css('.spoiler-content'));
		expect(spoilerContent).toBeTruthy();

		const button = fixture.debugElement.query(By.css('.spoiler-icon')).nativeElement;
		button.dispatchEvent(new Event('click'));
		fixture.detectChanges();

		const standardContent = fixture.debugElement.query(By.css('.standard-message'));
		expect(standardContent).toBeTruthy();
	});

	it('should show spoiler topic', () => {
		const spoilerTopic = 'topic test';
		component.message.spoiler = true;
		component.message.spoilerTopic = spoilerTopic;
		fixture.detectChanges();
		const spoilerContent = fixture.debugElement.query(By.css('tui-tag'));
		expect(spoilerContent.nativeElement.innerText).toBe(spoilerTopic);
	});

	it('should not show spoiler topic', () => {
		const spoilerTopic = '';
		component.message.spoiler = true;
		component.message.spoilerTopic = spoilerTopic;
		fixture.detectChanges();
		const spoilerContent = fixture.debugElement.query(By.css('tui-tag'));
		expect(spoilerContent.nativeElement.innerText).toBe('unknown');
	});

	it('should show message sent time', () => {
		const sentDate = new Date();
		const expectedValue = component.toTime(sentDate.toString());
		component.message.sentDate = sentDate;
		fixture.detectChanges();
		const time = fixture.debugElement.query(By.css('.date')).nativeElement;
		expect(time.textContent.trim()).toBe(expectedValue);
	});

});
