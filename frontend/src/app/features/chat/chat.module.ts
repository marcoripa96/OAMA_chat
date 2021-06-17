import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiBadgeModule, TuiMarkerIconModule, TuiTextAreaModule } from '@taiga-ui/kit';
import {
	TuiButtonModule, TuiHintModule, TuiScrollbarModule,
	TuiSvgModule, TuiTextfieldControllerModule, TuiHostedDropdownModule,
	TuiDataListModule
} from '@taiga-ui/core';
import { SocketService } from '@shared/services/socket.service';
import { TuiMapperPipeModule, TuiScrollService } from '@taiga-ui/cdk';
import { TuiAvatarModule } from '@taiga-ui/kit';

import { PreviewModule } from '@shared/components/preview/preview.module';
import { SettingsModule } from './components/settings/settings.module';
import { SearchModule } from './components/search/search.module';
import { SidebarModule } from '@shared/components/sidebar/sidebar.module';
import { MessageModule } from './components/message/message.module';
import { ScrollToBottomModule } from './directives/scroll-bottom.directive';
import { ActiveUsersListModule } from './components/active-users-list/active-users-list.module';
import { BottomBarModule } from './components/bottom-bar/bottom-bar.module';
import { ToFormattedDatePipeModule } from '@shared/pipes/to-formatted-date/to-formatted-date.pipe';
import { StickyMessageModule } from './components/sticky-message/sticky-message.module';

@NgModule({
	imports: [
		CommonModule,
		SidebarModule,
		SettingsModule,
		SearchModule,
		ActiveUsersListModule,
		ScrollToBottomModule,
		ToFormattedDatePipeModule,
		TuiBadgeModule,
		TuiScrollbarModule,
		TuiSvgModule,
		TuiMapperPipeModule,
		TuiAvatarModule,
		TuiHintModule,
		PreviewModule,
		MessageModule,
		BottomBarModule,
		TuiHostedDropdownModule,
		TuiDataListModule,
		StickyMessageModule
	],
	declarations: [ChatComponent],
	exports: [ChatComponent],
	providers: [SocketService, TuiScrollService]
})
export class ChatModule { }
