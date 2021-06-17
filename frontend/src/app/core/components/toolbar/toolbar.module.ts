import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { TuiButtonModule, TuiDataListModule, TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core';
import { RouterModule } from '@angular/router';
import { DividerModule } from '@shared/components/divider/divider.module';
import { TuiRadioLabeledModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		TuiSvgModule,
		TuiButtonModule,
		DividerModule,
		TuiHostedDropdownModule,
		TuiDataListModule,
		TuiRadioLabeledModule
	],
	declarations: [ToolbarComponent],
	exports: [ToolbarComponent]
})
export class ToolbarModule { }
