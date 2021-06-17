import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangelogComponent } from './changelog.component';
import { RouterModule, Routes } from '@angular/router';
import { TuiButtonModule, TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { DividerModule } from '@shared/components/divider/divider.module';

export const routes: Routes = [
	{
		path: '',
		component: ChangelogComponent
	},
];

@NgModule({
	imports: [
		CommonModule,
		TuiLinkModule,
		DividerModule,
		TuiSvgModule,
		TuiButtonModule,
		RouterModule.forChild(routes)
	],
	declarations: [ChangelogComponent]
})
export class ChangelogModule { }
