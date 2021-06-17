import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TuiDialogModule, TuiNotificationsModule, TuiRootModule } from '@taiga-ui/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TOKENAPI } from './shared/tokens/token-api';
import { environment } from 'environments/environment';

import { RouterModule } from '@angular/router';
import { HttpErrorInterceptor } from './core/interceptors/http-error/http-error.interceptors';

import { ToolbarModule } from './core/components/toolbar/toolbar.module';
import { DarkThemeModule } from './core/components/dark-theme/dark-theme.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { iconsPath } from '@shared/factories/icon-path.factory';
import { TUI_ICONS_PATH } from '@taiga-ui/core';
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		TuiRootModule,
		HttpClientModule,
		InlineSVGModule.forRoot(),
		TuiDialogModule,
		TuiNotificationsModule,
		AppRoutingModule,
		RouterModule,
		ToolbarModule,
		DarkThemeModule
	],
	providers: [
		{ provide: TOKENAPI, useValue: environment.backendUrl },
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpErrorInterceptor,
			multi: true
		},
		{
			provide: TUI_ICONS_PATH,
			useValue: iconsPath('assets/taiga-ui/icons/')
		   }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
