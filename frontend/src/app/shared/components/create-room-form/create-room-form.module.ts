import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoomFormComponent } from './create-room-form.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TuiIslandModule, TuiTextAreaModule } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiInputPasswordModule } from '@taiga-ui/kit';;
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiNotificationModule } from '@taiga-ui/core';
import { TuiHintModule } from '@taiga-ui/core';
import { TuiToggleModule } from '@taiga-ui/kit';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TuiIslandModule,
		TuiInputModule,
		TuiButtonModule,
		TuiInputPasswordModule,
		TuiSvgModule,
		TuiTextfieldControllerModule,
		TuiNotificationModule,
		TuiHintModule,
		TuiToggleModule,
		TuiTextAreaModule
	],
	declarations: [CreateRoomFormComponent],
	exports: [CreateRoomFormComponent]
})
export class CreateRoomFormModule { }
