import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ChatMessage } from '@shared/models/message';
import { LOOSE_URL_REGEX } from '@shared/utils/link-regex';

/**
 * Component which disaplys a chat message
 */
@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit {
	// menu items

	@Input() item: number;
	// sticky message object
	@Output() stickyMessage: EventEmitter<ChatMessage>= new EventEmitter();
	// chat message object
	@Input() message: ChatMessage;
	// to apply different styles if sent or received message
	@Input() type: 'sent' | 'received' = 'sent';
	// to show the avatar
	@Input() showAvatar = false;
	// to show the username
	@Input() showUsername = false;
	// set preview of a link to static or dynamic
	@Input() preview: 'static' | ' dynamic' = 'static';
	// to check the status of the menu
	messageMenuOpen = false;

	btnMoreClass = 'hidden';
	messageHover = false;


	// bind the correct class to host element
	@HostBinding('class') get hostClass() {
		return `${this.type}-wrapper`;
	}


	constructor() {
	}

	ngOnInit() { }

	/**
	 * Show a message marked as spoiler
	 */
	showSpoiler(message: ChatMessage): void {
		message.spoiler = false;
	}

	/**
 	* Maps text into text with links
 	*/
	highlightLinks(text: string): string {
		// a less rigid regex than the one used for previews
		const newText = text.replace(LOOSE_URL_REGEX, (match) => `<a class="link" href='//${match}' target='_blank'>${match}</a>`);
		return newText;
	}

	/**
	 * Given a string corresponding to a UTC date it returns a formatted time
	 */
	toTime(utcDate: string): string {
		const date = new Date(utcDate);
		const hours = ('0' + date.getHours()).slice(-2);
		const minutes = ('0' + date.getMinutes()).slice(-2);
		return hours + ':' + minutes;
	}
	/**
	 * Take menu action and progate it to the parent component
	 */
	handlePin(): void{
		this.stickyMessage.emit(this.message);
		this.messageMenuOpen = false;
	}

	/**
	 * Manage menu icon
	 */
	moreBtnOnClick(): void{
		if(this.messageHover){
			this.btnMoreClass='clicked';
		}
		else {
			this.btnMoreClass='hidden';
		}
	}
	/**
	 * Show menu icon
	 */
	mouseEnter(): void{
		this.messageHover = true;
		this.btnMoreClass='clicked';
	}
	/**
	 * Hide menu icon
	 */
	mouseLeave(): void{
		this.messageHover = false;
		this.btnMoreClass='hidden';
	}
}
