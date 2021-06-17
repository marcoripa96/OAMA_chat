import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

/**
 * Component which provides an svg with a bubble animation
 */
@Component({
	selector: 'app-airplain-animation',
	templateUrl: './airplain-animation.component.html',
	styleUrls: ['./airplain-animation.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirplainAnimationComponent implements OnInit {

	// color of bubble
	@Input() bubbleColor = '';

	constructor() { }

	ngOnInit() {
	}

}
