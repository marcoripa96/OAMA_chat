import { Routes } from '@angular/router';

export const ROUTES: Routes = [
	{
	    path: '',
	    loadChildren: () => import('@features/home/home.module').then(m => m.HomeModule)
	},
	{
	    path: 'changelog',
	    loadChildren: () => import('@features/changelog/changelog.module').then(m => m.ChangelogModule)
	},
	{
		path: 'lobby',
		loadChildren: () => import('@features/lobby/lobby.module').then(m => m.LobbyModule)
	},
	{
		path: 'signup',
		loadChildren: () => import('@features/signup/signup.module').then(m => m.SignupModule)
	},
	{
		path: 'signup/verify',
		loadChildren: () => import('@features/verify/verify.module').then(m => m.VerifyModule)
	},
	{
		path: ':room',
		loadChildren: () => import('@features/room/room.module').then(m => m.RoomModule)
	},
	// if route not found redirect to home
	{ path: '**', redirectTo: '' }
];
