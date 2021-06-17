import { Directive, ElementRef, Input, NgModule, OnDestroy, OnInit } from '@angular/core';

// Threshold in % of the container height from which the content is scrolled to the bottom
const OFFSET_BOTTOM_THRESHOLD = 20;

/**
 * Provides a directive to keep a content wrapped in a TuiScrollbar
 * scrolled at the bottom (Chat style).
 */
@Directive({
	selector: '[appScrollBottom]'
})
export class ScrollBottomDirective implements OnInit, OnDestroy {
	// Scrollable container inside the TuiScrollbar
	@Input() scrollableContainer: HTMLDivElement;

	// Container height
	private _containerHeight: number;
	// Previous scroll top position
	private _previousScrollTop: number;

	// Mutation observer which emits whenever an element is added to the DOM inside the container
	private readonly _observer = new MutationObserver(() => this._update());

	constructor(private _el: ElementRef) { }

	ngOnInit() {
		// Observe for changes on childrens of container
		this._observer.observe(this.scrollableContainer, {
			childList: true
		});

		// Set the container initial height
		this._containerHeight = this._el.nativeElement.offsetHeight;
	}

	ngOnDestroy() {
		// Stop observing events
		this._observer.disconnect();
	}

	// Updates scroll position
	private _update(): void {
		if (
			this._el.nativeElement.scrollTop <
			this._percentage(this._previousScrollTop, OFFSET_BOTTOM_THRESHOLD)
		) {
			this._previousScrollTop =
				this._el.nativeElement.scrollHeight - this._containerHeight;

			// here a message is received while scrolled up, we can emit an event like
			// "you have new messages"
			return;
		}

		this._el.nativeElement.scrollTop = this._el.nativeElement.scrollHeight;
		this._previousScrollTop = this._el.nativeElement.scrollTop;
	}

	private _percentage(n: number, percentage: number): number {
		return n - (n * percentage) / 100;
	}
}


@NgModule({
	declarations: [ScrollBottomDirective],
	exports: [ScrollBottomDirective]
})
export class ScrollToBottomModule { }
