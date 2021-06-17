import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room.component';
import { RouterModule, Routes } from '@angular/router';
import { ChatModule } from '@features/chat/chat.module';
import { UsernameModule } from '@features/username/username.module';

import { CreateRoomModule } from '@features/create-room/create-room.module';

export const routes: Routes = [
	{
		path: '',
		component: RoomComponent
	},
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ChatModule,
		UsernameModule,
		CreateRoomModule,
	],
	declarations: [RoomComponent]
})
export class RoomModule { }
