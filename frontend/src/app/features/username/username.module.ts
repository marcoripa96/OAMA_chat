import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsernameComponent } from './username.component';
import { TuiButtonModule, TuiLabelModule, TuiNotificationModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiInputPasswordModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';

@NgModule({
	imports: [
		CommonModule,
		TuiButtonModule,
		FormsModule,
		ReactiveFormsModule,
		TuiLabelModule,
		TuiTextfieldControllerModule,
		TuiInputModule,
		TuiMapperPipeModule,
		TuiIslandModule,
		TuiInputPasswordModule,
		TuiSvgModule,
		TuiNotificationModule
	],
	declarations: [
		UsernameComponent
	],
	exports: [
		UsernameComponent
	]
})
export class UsernameModule { }
