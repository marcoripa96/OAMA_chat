import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { AbstractTuiThemeSwitcher } from '@taiga-ui/cdk';

/**
 * Component which overrides root css variables to apply dark theme
 */

@Component({
	selector: 'app-dark-theme',
	templateUrl: './dark-theme.component.html',
	styleUrls: ['./dark-theme.component.scss'],
	// Set encapsulation none to ovveride root style
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DarkThemeComponent extends AbstractTuiThemeSwitcher{

	constructor(@Inject(DOCUMENT) documentRef: any) {
		super(documentRef as Document);
	}

}
