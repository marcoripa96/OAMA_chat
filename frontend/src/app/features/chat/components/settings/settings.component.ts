import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SidebarService } from '@shared/services/sidebar/sidebar.service';
import { ThemeService } from '@shared/services/theme/theme.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { map, takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	providers: [TuiDestroyService],
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
export class SettingsComponent implements OnInit {

	// Theme form
	themeForm = new FormGroup({
		theme: new FormControl()
	});

	// Each tab of the accordion
	accordionItems = [{
		id: 'theme',
		value: false
	}];

	constructor(
		private readonly _themeService: ThemeService,
		private readonly _sidebarService: SidebarService,
		private readonly _destroy$: TuiDestroyService
	) { }

	ngOnInit() {

		// Update form if theme changes from another source component
		this._themeService.theme$.pipe(takeUntil(this._destroy$)).subscribe(theme => {
			this.themeForm.patchValue({
				theme: theme.selected
			}, {emitEvent: false});
		});

		// Whenever a new theme is selected it get nexted by the service
		this.themeForm.valueChanges
			.pipe(
				map(formValues => formValues.theme),
				takeUntil(this._destroy$)
			)
			.subscribe(theme => this._themeService.set(theme));
	}

	/**
	 * Close sidebar and inner accordions
	 */
	closeSidebar(): void {
		this._closeAllAccordions();
		this._sidebarService.hide();
	}

	/**
	 * Close open accordions
	 */
	private _closeAllAccordions(): void {
		this.accordionItems.forEach(item => item.value = false);
	}



}
