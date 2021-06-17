import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiNotificationModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { ListSliderModule } from './components/list-slider/list-slider.module';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { AirplainAnimationModule } from './components/airplain-animation/airplain-animation.module';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ListSliderModule,
		TuiInputModule,
		TuiButtonModule,
		TuiSvgModule,
		TuiTextfieldControllerModule,
		InlineSVGModule,
		TuiIslandModule,
		TuiLinkModule,
		TuiNotificationModule,
		IntersectionObserverModule,
		AirplainAnimationModule,
		RouterModule.forChild(routes)
	],
	declarations: [HomeComponent]
})
export class HomeModule { }
