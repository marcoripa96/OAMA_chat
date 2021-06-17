import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostBinding, Inject, OnInit } from '@angular/core';
import { WINDOW } from '@ng-web-apis/common';

@Component({
	selector: 'app-scroll-top',
	templateUrl: './scroll-top.component.html',
	styleUrls: ['./scroll-top.component.scss'],
	animations: [
		trigger('fade', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('250ms ease-out', style({ opacity: 1 })),
			])
		]),
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollTopComponent implements OnInit {

	@HostBinding('@fade') get fade(): boolean {
		return true;
	}

	constructor(
		@Inject(WINDOW) private readonly window: Window
	) { }

	ngOnInit() {

	}

	scrollTop(): void {
		this.window.scrollTo({ top: 0, behavior: 'smooth' });
	}

}
