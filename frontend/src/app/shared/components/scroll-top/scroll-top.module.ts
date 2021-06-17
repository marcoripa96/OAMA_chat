import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollTopComponent } from './scroll-top.component';
import { TuiButtonModule } from '@taiga-ui/core';

@NgModule({
	imports: [
		CommonModule,
		TuiButtonModule
	],
	declarations: [ScrollTopComponent],
	exports: [ScrollTopComponent]
})
export class ScrollTopModule { }
