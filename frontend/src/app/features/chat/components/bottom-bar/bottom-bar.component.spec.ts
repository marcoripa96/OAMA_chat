import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChatMessage } from '@shared/models/message';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BottomBarModule } from './bottom-bar.module';
import { BottomBarComponent } from './bottom-bar.component';
import { LinkPreviewService } from '@shared/services/link-preview/link-preview.service';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Visibility } from '@shared/services/room-config/room-config.service';
import { LinkPreviewResponse } from '@shared/models/linkPreview';
import { of } from 'rxjs';
import { PreviewComponent } from '@shared/components/preview/preview.component';
import { TuiDestroyService } from '@taiga-ui/cdk';

describe('BottomBarComponent', () => {
	let fixture: ComponentFixture<BottomBarComponent>;
	let component: BottomBarComponent;
	let linkPreviewService: LinkPreviewService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [],
			providers: [
				LinkPreviewService,
				TuiDestroyService,
				{ provide: TOKENAPI, useValue: environment.backendUrl },
			],
			imports: [
				BrowserAnimationsModule,
				BottomBarModule,
				HttpClientTestingModule,
				ReactiveFormsModule
			]
		}).compileComponents();
		// init
		fixture = TestBed.createComponent(BottomBarComponent);
		component = fixture.componentInstance;
		linkPreviewService = TestBed.inject(LinkPreviewService);

	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});

	it('should toggle spoiler for a new message', () => {
		// set data
		component.roomConfig = {
			name: 'room',
			username: 'fellow oamer',
			visibility: Visibility.chat
		};

		const message: ChatMessage = {
			_id: '1245',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test',
			spoiler: true
		};

		component.messageForm.controls.newMessage.setValue(message.content);

		// check correctness
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		// mark spoiler
		const btnMarkSpoiler = debugElement.query(By.css('.message-options .spoiler-icon')).nativeElement;
		btnMarkSpoiler.click();
		expect(component.spoiler).toBeTrue();
		// unmark spoiler
		btnMarkSpoiler.click();
		expect(component.spoiler).toBeFalse();
	});

	it('should toggle spoiler topic for a new message', () => {
		// set data
		component.roomConfig = {
			name: 'room',
			username: 'fellow oamer',
			visibility: Visibility.chat
		};

		const message: ChatMessage = {
			_id: '1245',
			username: 'fellow oamer',
			room: 'room',
			content: 'content test',
			spoiler: true
		};

		component.messageForm.controls.newMessage.setValue(message.content);

		// check correctness
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		// mark spoiler
		const btnMarkSpoiler = debugElement.query(By.css('.message-options .spoiler-icon')).nativeElement;
		btnMarkSpoiler.click();
		fixture.detectChanges();
		// add spoiler topic
		const btnSpoilerTopic = debugElement.query(By.css('.message-options .spoiler-topic-icon')).nativeElement;
		btnSpoilerTopic.click();
		expect(component.hasSpoilerTopic).toBeTrue();
		// remove spoiler topic
		btnSpoilerTopic.click();
		expect(component.hasSpoilerTopic).toBeFalse();
	});

	it('should show dynamic link preview while typing', fakeAsync(() => {
		// set data
		const firstLinkPreview: LinkPreviewResponse = {
			data: {
				url: 'www.test_url.test',
				title: 'test_title',
				description: 'test_description',
				image: 'test_image',
			}
		};

		spyOn(linkPreviewService, 'getLinkPreview').and.returnValue(of(firstLinkPreview));

		// check correctness
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		component.messageForm.patchValue({ newMessage: 'www.urltest.test' });
		tick(100);
		fixture.detectChanges();
		const previewComponent = debugElement.query(By.directive(PreviewComponent));
		const previewElement = previewComponent.query(By.css('.preview-wrapper.dynamic'));
		expect(previewElement).toBeTruthy();
		discardPeriodicTasks();

	}));

	it('should emit a new message', () => {
		// set data
		component.roomConfig = {
			name: 'room',
			username: 'fellow oamer',
			visibility: Visibility.chat
		};

		spyOn(component.send, 'emit');
		component.sendMessage(null);
		expect(component.send.emit).toHaveBeenCalled();
	});

	it('should emit a new spoiler message', () => {
		// set data
		component.roomConfig = {
			name: 'room',
			username: 'fellow oamer',
			visibility: Visibility.chat
		};

		const message: ChatMessage = {
			username: 'fellow oamer',
			room: 'room',
			content: 'content test',
			spoiler: true,
			spoilerTopic: 'topic test',
			firstLinkPreview: null
		};

		// spy on new message event emit to parent component
		spyOn(component.send, 'emit');

		// check correctness
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		// mark spoiler
		const btnMarkSpoiler = debugElement.query(By.css('.message-options .spoiler-icon')).nativeElement;
		btnMarkSpoiler.click();
		fixture.detectChanges();
		// add spoiler topic
		const btnSpoilerTopic = debugElement.query(By.css('.message-options .spoiler-topic-icon')).nativeElement;
		btnSpoilerTopic.click();
		component.messageForm.controls.spoilerTopic.setValue(message.spoilerTopic);
		// send message
		component.messageForm.controls.newMessage.setValue(message.content);
		fixture.detectChanges();
		const btnSend = debugElement.query(By.css('.btn-send')).nativeElement;
		btnSend.click();
		// verify emitted message
		expect(component.send.emit).toHaveBeenCalledWith(message);
	});
});
