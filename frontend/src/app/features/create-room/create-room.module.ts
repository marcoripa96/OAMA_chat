import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRoomComponent } from './create-room.component';

import { CreateRoomFormModule } from '@shared/components/create-room-form/create-room-form.module';

import { TuiMapperPipeModule } from '@taiga-ui/cdk';
import { TuiSvgModule } from '@taiga-ui/core';



@NgModule({
	imports: [
		CommonModule,
		TuiMapperPipeModule,
		TuiSvgModule,
		CreateRoomFormModule
	],
	declarations: [CreateRoomComponent],
	exports: [CreateRoomComponent]
})
export class CreateRoomModule { }
