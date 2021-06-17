import {
	ChangeDetectionStrategy,
	Component, ElementRef,
	HostListener, OnInit, Renderer2
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { SidebarService, SidebarStatus } from '@shared/services/sidebar/sidebar.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


/**
 * A component which implements a toggable sidebar
 */

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	animations: [
		trigger('animateSidebar', [
			transition(':enter', [
				style({ transform: 'translateX(100%)' }),
				animate('200ms ease-out', style({ transform: 'translateX(0)' }))
			]),
			transition(':leave', [
				style({ transform: 'translateX(0)' }),
				animate('200ms ease-out', style({ transform: 'translateX(100%)' }))
			]),
		]),
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

	// Emits the sidebar status
	status$: Observable<SidebarStatus>;

	constructor(
		private readonly _sidebarService: SidebarService,
		private readonly _elementRef: ElementRef,
		private readonly _renderer: Renderer2
	) { }

	ngOnInit() {
		// Get sidebar status from service, whenever it emits
		// apply or remove the 'opened' class to the host component
		// Use tap to perferm a side operation so that I can keep using the async pipe
		this.status$ = this._sidebarService.status$
			.pipe(tap(status => this._applyClassToHost(status.open)));
	}

	/**
	 * Listen for mousedown clicks on the host component
	 */
	@HostListener('mousedown', ['$event.target'])
	onClick(elem) {
		// if the clicked element is the host component 'app-sidebar'
		// close the sidebar
		if (elem === this._elementRef.nativeElement) {
			this._sidebarService.hide();
		}
	}

	/**
	 * Add or remove the 'opened' class to the host component
	 */
	private _applyClassToHost(open: boolean): void {
		if (open) {
			this._renderer.addClass(this._elementRef.nativeElement, 'opened');
		} else {
			this._renderer.removeClass(this._elementRef.nativeElement, 'opened');
		}
	}
}
