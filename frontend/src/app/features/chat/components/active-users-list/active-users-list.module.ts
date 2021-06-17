import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveUsersListComponent } from './active-users-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiTextfieldControllerModule, TuiSvgModule,
	TuiScrollbarModule, TuiHostedDropdownModule, TuiGroupModule, TuiDataListModule, TuiDropdownControllerModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputModule } from '@taiga-ui/kit';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';
import { DialogActiveUsersComponent } from './dialog-active-users/dialog-active-users.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TuiAvatarModule,
    	TuiButtonModule,
		TuiInputModule,
		TuiTextfieldControllerModule,
		TuiSvgModule,
		TuiScrollbarModule,
		TuiMapperPipeModule,
		TuiHostedDropdownModule,
		TuiGroupModule,
		TuiDataListModule,
		TuiDropdownControllerModule
	],
	declarations: [ActiveUsersListComponent, DialogActiveUsersComponent],
	exports: [ActiveUsersListComponent]
})
export class ActiveUsersListModule { }
