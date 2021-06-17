import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StickyMessageComponent } from './sticky-message.component';
import { TrackerModule } from '../tracker/tracker.module';
import { MarkdownPipeModule } from '@features/chat/pipes/markdown.pipe';


@NgModule({
	imports: [
		CommonModule,
		TrackerModule,
		MarkdownPipeModule
	],
	declarations: [StickyMessageComponent],
	exports: [StickyMessageComponent]
})
export class StickyMessageModule { }
