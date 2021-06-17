import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TuiAvatarModule, TuiInputModule, TuiRadioBlockModule } from '@taiga-ui/kit';
import { TuiGroupModule, TuiLoaderModule, TuiSvgModule, TuiTextfieldControllerModule, TuiLinkModule } from '@taiga-ui/core';
import { EllipsisModule } from 'ngx-ellipsis';
import { ChatComponent } from '@features/chat/chat.component';
import { MarkdownPipeModule } from '@features/chat/pipes/markdown.pipe';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TuiSvgModule,
		TuiInputModule,
		TuiTextfieldControllerModule,
		TuiAvatarModule,
		TuiLoaderModule,
		TuiRadioBlockModule,
		TuiGroupModule,
		TuiSvgModule,
		TuiLinkModule,
		EllipsisModule,
		MarkdownPipeModule
	],
	declarations: [SearchComponent],
	providers: [ChatComponent],
	exports: [SearchComponent]
})
export class SearchModule { }
