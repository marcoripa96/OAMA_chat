import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirplainAnimationComponent } from './airplain-animation.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [AirplainAnimationComponent],
	exports: [AirplainAnimationComponent]
})
export class AirplainAnimationModule { }
