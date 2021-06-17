import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ScrollService } from '@shared/services/scroll/scroll.service';
import { ThemeService } from '@shared/services/theme/theme.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { merge } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

/**
 * Provides a toolbar component for the web application.
 */
@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
	providers: [TuiDestroyService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit {

	// Emits scroll position on window scroll
	readonly scroll$ = this._scrollService.scroll$;

	// Theme dropdown status
	openThemeDropdown = false;

	// Theme form value
	themeForm = new FormGroup({
		theme: new FormControl()
	});

	constructor(
		private readonly _scrollService: ScrollService,
		private readonly _themeService: ThemeService,
		private readonly _destroy$: TuiDestroyService
	) { }

	ngOnInit() {
		// Set form value if it is set from another component
		this._themeService.theme$.pipe(takeUntil(this._destroy$)).subscribe(theme => {
			// path form and don't emit changes
			this.themeForm.patchValue({
				theme: theme.selected
			}, {emitEvent: false});
		});

		// On radio check set new theme
		this.themeForm.valueChanges
			.pipe(
				map(formValues => formValues.theme),
				takeUntil(this._destroy$)
			)
			.subscribe(theme => this._themeService.set(theme));
	}

}
