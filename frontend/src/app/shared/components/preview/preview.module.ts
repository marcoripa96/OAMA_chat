import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from './preview.component';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';
import { TuiLoaderModule } from '@taiga-ui/core';

@NgModule({
	imports: [
		CommonModule,
		TuiMapperPipeModule,
		TuiLoaderModule
	],
	declarations: [PreviewComponent],
	exports: [PreviewComponent]
})
export class PreviewModule { }
