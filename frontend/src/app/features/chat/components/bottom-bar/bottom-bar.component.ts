import {
	AfterViewInit,
	ChangeDetectorRef, Component, ElementRef, EventEmitter,
	Input, OnInit, Output, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LinkPreview, LinkPreviewResponse } from '@shared/models/linkPreview';
import { ChatMessage } from '@shared/models/message';
import { LinkPreviewService } from '@shared/services/link-preview/link-preview.service';
import { RoomConfig } from '@shared/services/room-config/room-config.service';
import { STRICT_URL_REGEX } from '@shared/utils/link-regex';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiExpandComponent } from '@taiga-ui/core';
import { TuiInputComponent, TuiTextAreaComponent } from '@taiga-ui/kit';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap, timeout } from 'rxjs/operators';

@Component({
	selector: 'app-bottom-bar',
	templateUrl: './bottom-bar.component.html',
	styleUrls: ['./bottom-bar.component.scss']
})
export class BottomBarComponent implements OnInit {
	// room configuration
	@Input() roomConfig: RoomConfig;

	// element ref to textarea
	@ViewChild(TuiTextAreaComponent, { read: ElementRef }) newMessageComponent: ElementRef;

	// form new message
	messageForm = new FormGroup({
		newMessage: new FormControl(),
		spoilerTopic: new FormControl()
	});

	// observable to emit link preview events
	firstLinkPreview$: Observable<LinkPreviewResponse>;
	// loading on preview events
	pendingPreviewRequest = false;
	// to prevent undesired effects in case of delayed response
	resetLinkPreview = false;
	// to avoid useless link preview requests
	private _previousUrl = null;
	// to unsubscribe from firstLinkPreview$
	private _unsubscribeGetLinkPreview = new Subject<void>();

	// track if current message is a spoiler
	spoiler = false;
	hasSpoilerTopic = false;

	// event to trigger send message in the parent component
	@Output() send: EventEmitter<ChatMessage> = new EventEmitter();

	constructor(
		private _cdr: ChangeDetectorRef,
		private _linkPreviewService: LinkPreviewService,
		private readonly _destroy$: TuiDestroyService) { }

	ngOnInit() {
		// emit link preview events
		this.firstLinkPreview$ = this.messageForm.get('newMessage').valueChanges.pipe(
			debounceTime(100),
			distinctUntilChanged(),
			map(text => this._getFirstUrl(text)),
			filter(url => this._previousUrl !== url),
			switchMap(url => {
				this.pendingPreviewRequest = true;
				this._cdr.markForCheck();
				this._previousUrl = url;
				if (url) {
					return this._linkPreviewService.getLinkPreview(url)
						.pipe(
							timeout(5000),
							catchError(err => of(null)),
							takeUntil(this._unsubscribeGetLinkPreview)
						);
				} else {
					return of(null);
				}
			}),
			map(data => {
				if (data) {
					if (this._isUsefulPreview(data.data)) {
						return data;
					}
				}
				return null;
			}),
			tap(() => {
				this.pendingPreviewRequest = false;
				this._cdr.markForCheck();
			}),
			takeUntil(this._destroy$)
		);
	}

	/**
	 * Send the new message
	 */
	sendMessage(firstLinkPreview: LinkPreview) {
		// abort link preview subscription to avoid delayed response
		this._unsubscribeGetLinkPreview.next();
		this._unsubscribeGetLinkPreview.complete();
		firstLinkPreview = this.pendingPreviewRequest ? null : firstLinkPreview;
		// prepare message
		const message: ChatMessage = {
			username: this.roomConfig.username,
			room: this.roomConfig.name,
			content: this.messageForm.get('newMessage').value,
			spoiler: this.spoiler,
			spoilerTopic: this.messageForm.get('spoilerTopic').value,
			firstLinkPreview
		};

		// init new message
		this.initNewMessage();

		this.send.emit(message);
	}

	/**
	 * Check message validity
	 */
	isValidMessage(): boolean {
		const message = this.messageForm.get('newMessage').value;
		return message !== null && message.trim() !== '';
	}

	/**
	 * Set default values to the new message
	 */
	initNewMessage(): void {
		this.spoiler = false;
		this.hasSpoilerTopic = false;
		this.messageForm.controls.newMessage.setValue('');
		this.messageForm.controls.spoilerTopic.setValue('');
		this.resetLinkPreview = true;
	}

	/**
	 * Toggle spoiler option of a new message
	 */
	toggleSpoiler(): void {
		this.focusNewMessage();
		this.spoiler = !this.spoiler;
		this.hasSpoilerTopic = false;
	}

	/**
	 * Toggle spoiler topic of a new message
	 */
	toggleSpoilerTopic(): void {
		this.hasSpoilerTopic = !this.hasSpoilerTopic;
		if (!this.hasSpoilerTopic) {
			this.messageForm.get('spoilerTopic').setValue('');
			this.focusNewMessage();
		} else {
			//this.focusSpoilerTopic();
		}
	}

	/**
	 * Reset link preview to avoid wrong previews
	 */
	resetPreview(): void {
		this.resetLinkPreview = false;
	}

	/**
	 * Check if the preview is useful
	 */
	private _isUsefulPreview(linkPreview: LinkPreview): boolean {
		return linkPreview.title !== null && linkPreview.title !== ''
			&& linkPreview.image !== null && linkPreview.image !== '';
	}

	/**
	 * Return the first url found in a message
	 */
	private _getFirstUrl(text: string): string {
		const results = text.match(STRICT_URL_REGEX);
		return results ? results[0] : null;
	}

	/**
	 * Focus newMessage text area
	 */
	focusNewMessage() {
		this.newMessageComponent.nativeElement.querySelector('textarea').focus();
	}

}
