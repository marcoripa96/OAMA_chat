import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyComponent } from './verify.component';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		component: VerifyComponent
	},
];

@NgModule({
	declarations: [
		VerifyComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		TuiButtonModule,
		TuiInputModule,
		TuiIslandModule
	]
})
export class VerifyModule { }
