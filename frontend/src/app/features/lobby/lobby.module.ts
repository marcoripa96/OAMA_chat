import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyComponent } from './lobby.component';
import { RouterModule, Routes } from '@angular/router';
import { TuiActionModule, TuiInputModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiLinkModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { DividerModule } from '@shared/components/divider/divider.module';
import { ScrollTopModule } from '@shared/components/scroll-top/scroll-top.module';

export const routes: Routes = [
	{
		path: '',
		component: LobbyComponent
	},
];

@NgModule({
	imports: [
		CommonModule,
		TuiActionModule,
		ScrollTopModule,
		FormsModule,
		ReactiveFormsModule,
		TuiInputModule,
		TuiTextfieldControllerModule,
		DividerModule,
		TuiButtonModule,
		TuiSvgModule,
		TuiLinkModule,
		RouterModule.forChild(routes)
	],
	declarations: [LobbyComponent],
})
export class LobbyModule { }
