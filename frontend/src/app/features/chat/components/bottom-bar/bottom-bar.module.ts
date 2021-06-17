import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomBarComponent } from './bottom-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreviewModule } from '@shared/components/preview/preview.module';
import { TuiButtonModule, TuiExpandModule, TuiHintModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiTextAreaModule, TuiMarkerIconModule, TuiInputModule } from '@taiga-ui/kit';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TuiTextAreaModule,
		TuiTextfieldControllerModule,
		TuiButtonModule,
		TuiSvgModule,
		TuiMarkerIconModule,
		PreviewModule,
		TuiHintModule,
		TuiExpandModule,
		TuiInputModule,
		TuiAutoFocusModule
	],
	declarations: [BottomBarComponent],
	exports: [BottomBarComponent]
})
export class BottomBarModule { }
