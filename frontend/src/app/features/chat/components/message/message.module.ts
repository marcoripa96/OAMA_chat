import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';
import { PreviewModule } from '@shared/components/preview/preview.module';

import { TuiButtonModule, TuiHintModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiTagModule } from '@taiga-ui/kit';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';
import {TuiHostedDropdownModule} from '@taiga-ui/core';
import {TuiDataListModule} from '@taiga-ui/core';
import { MarkdownPipeModule } from '@features/chat/pipes/markdown.pipe';


@NgModule({
	imports: [
		CommonModule,
		PreviewModule,
		TuiSvgModule,
		TuiAvatarModule,
		TuiHintModule,
		TuiMapperPipeModule,
		TuiTagModule,
		TuiHostedDropdownModule,
		TuiDataListModule,
		TuiButtonModule,
		MarkdownPipeModule
	],
	declarations: [MessageComponent],
	exports: [MessageComponent]
})
export class MessageModule { }
