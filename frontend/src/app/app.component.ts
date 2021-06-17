import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { WINDOW } from '@ng-web-apis/common';
import { ScrollService } from '@shared/services/scroll/scroll.service';
import { Theme, ThemeService } from '@shared/services/theme/theme.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { fromEvent, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [TuiDestroyService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
	title = 'frontend';

	// Emits the current theme
	theme$: Observable<Theme>;

	readonly scroll$ = fromEvent(this.window, 'scroll').pipe(
		map(() => this.window.scrollY)
	);

	constructor(
		private readonly _themeService: ThemeService,
		private readonly _scrollService: ScrollService,
		private readonly _destroy$: TuiDestroyService,
		@Inject(WINDOW) private readonly window: Window
	) {

	}

	ngOnInit() {
		this.theme$ = this._themeService.theme$;

		this.scroll$.pipe(
			takeUntil(this._destroy$)
		).subscribe(scrollY => {
			this._scrollService.updateScrollY(scrollY);
		});
	}
}
