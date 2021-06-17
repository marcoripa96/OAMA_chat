import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkThemeComponent } from './dark-theme.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [DarkThemeComponent],
	exports: [DarkThemeComponent]
})
export class DarkThemeModule { }
