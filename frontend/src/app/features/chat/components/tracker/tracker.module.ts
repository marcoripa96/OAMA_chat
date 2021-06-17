import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToArrayPipeModule } from '@shared/pipes/to-array.pipe';
import { TrackerComponent } from './tracker.component';

@NgModule({
	declarations: [TrackerComponent],
	exports: [TrackerComponent],
	imports: [
		CommonModule,
		ToArrayPipeModule
	]
})
export class TrackerModule { }
