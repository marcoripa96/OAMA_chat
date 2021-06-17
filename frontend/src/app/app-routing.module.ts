import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from './app-routes';


@NgModule({
	imports: [RouterModule.forRoot(ROUTES, {anchorScrolling: 'enabled'})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
