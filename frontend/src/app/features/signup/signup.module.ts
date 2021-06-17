import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup.component';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiNotificationModule } from '@taiga-ui/core';

export const routes: Routes = [
	{
		path: '',
		component: SignupComponent
	},
];

@NgModule({
	declarations: [
		SignupComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		TuiButtonModule,
		TuiInputModule,
		TuiInputPasswordModule,
		TuiIslandModule,
		TuiNotificationModule
	]
})
export class SignupModule { }
