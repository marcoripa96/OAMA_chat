import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';

/**
 * Components which displays a divider line
 */
@Component({
	selector: 'app-divider',
	templateUrl: './divider.component.html',
	styleUrls: ['./divider.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent implements OnInit {

	// Divider direction
	@Input() direction: 'vertical' | 'horizontal' = 'vertical';

	constructor() { }

	ngOnInit() {
	}

	/**
	 * Set class 'vertical' to host
	 */
	@HostBinding('class.vertical')
	get isVertical(): boolean {
		return this.direction === 'vertical';
	}

	/**
	 * Set class 'horizontal' to host
	 */
	@HostBinding('class.horizontal')
	get isHorizontal(): boolean {
		return this.direction === 'horizontal';
	}

}
