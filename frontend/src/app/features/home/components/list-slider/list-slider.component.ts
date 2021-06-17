import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Message, MESSAGES } from './data/messages';


/**
 * A component to provide the animation of random messages
 */
@Component({
	selector: 'app-list-slider',
	templateUrl: './list-slider.component.html',
	styleUrls: ['./list-slider.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('translate', [
			transition('* => true', [
				animate('{{ timeTranslate }}', keyframes([
					style({ transform: '*' }),
					style({ transform: 'translateX(calc(100vw - 160px))' }),
					style({ transform: 'translateX(0)' }),
					style({ transform: '*' }),
				]))
			], {
				params: {
					timeTranslate: '60s',
				}
			}),
		])
	]
})
export class ListSliderComponent implements OnInit {

	messages: Message[] = MESSAGES;

	constructor() { }

	ngOnInit() {
	}

	/**
	 * Restart animation when done
	 */
	animationDone(message: Message) {
		message.toggleAnimation = !message.toggleAnimation;
	}

}
