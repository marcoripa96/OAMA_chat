import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TuiSvgModule } from '@taiga-ui/core';
import { TuiAccordionModule } from '@taiga-ui/kit';
import { TuiRadioLabeledModule } from '@taiga-ui/kit';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TuiSvgModule,
		TuiAccordionModule,
		TuiRadioLabeledModule,
		TuiSvgModule
	],
	declarations: [SettingsComponent],
	exports: [SettingsComponent]
})
export class SettingsModule { }
