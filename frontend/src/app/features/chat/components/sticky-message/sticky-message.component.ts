import { animate, style, transition, trigger } from '@angular/animations';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	Input,
	OnInit,
	Output
} from '@angular/core';
import { ChatMessage } from '@shared/models/message';
@Component({
	selector: 'app-sticky-message',
	templateUrl: './sticky-message.component.html',
	styleUrls: ['./sticky-message.component.scss'],
	animations: [
		trigger('animateText', [
			transition('false => true', [
				style({ transform: 'translateY(-10px)', opacity: 0 }), // initial
				animate(
					'150ms ease-out',
					style({ transform: 'translateY(0)', opacity: 1 })
				)
			])
		]),
		trigger('animateEnter', [
			transition(':enter', [
				style({ transform: 'translateY(-20%)', opacity: 0 }), // initial
				animate(
					'150ms ease-out',
					style({ transform: 'translateY(0)', opacity: 1 })
				)
			]),
			transition(':leave', [
				style({ transform: 'translateY(0)', opacity: 1 }), // initial
				animate(
					'150ms ease-out',
					style({ transform: 'translateY(-20%)', opacity: 0 })
				)
			])
		]),
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StickyMessageComponent implements OnInit {
	// send next sticky message to parent component
	@Output() next: EventEmitter<ChatMessage> = new EventEmitter();
	// receive sticky message list from parent component
	@Input() messages: ChatMessage[] = [];

	@HostBinding('@animateEnter') get animateEnter(): boolean {
		return true;
	}
	// message index
	activeIndex = 0;
	// animation state
	animState = false;

	constructor() { }



	ngOnInit() {
	}

	/**
	 * Skip to the next pinned message
	 * */
	nextMessage(): void {
		this.activeIndex =
			this.activeIndex === this.messages.length - 1 ? 0 : this.activeIndex + 1;
		console.log(this.activeIndex);
		this.next.emit(this.messages[this.activeIndex]);
		this.animState = true;
	}

	onAnimationDone(): void {
		this.animState = false;
	}

}
