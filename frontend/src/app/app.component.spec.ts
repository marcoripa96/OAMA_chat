import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TOKENAPI } from '@shared/tokens/token-api';
import { TuiRootModule, TuiSvgModule } from '@taiga-ui/core';
import { environment } from 'environments/environment';
import { ROUTES } from './app-routes';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './core/components/toolbar/toolbar.component';
import { Location } from '@angular/common';
import { RoomModule } from '@features/room/room.module';

describe('AppComponent', () => {

	let fixture: ComponentFixture<AppComponent>;
	let router: Router;
	let location: Location;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				RouterTestingModule.withRoutes(ROUTES),
				HttpClientTestingModule,
				TuiRootModule,
				TuiSvgModule,
				RoomModule,
			],
			declarations: [
				AppComponent,
				ToolbarComponent
			],
			providers: [
				{ provide: TOKENAPI, useValue: environment.backendUrl }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);

		router = TestBed.inject(Router);
		location = TestBed.inject(Location);
		router.initialNavigation();
	});

	// check if app component gets instantiated
	it('should create the app', () => {
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});


	it('navigate to "" redirects you to /', fakeAsync(() => {
		router.navigate(['']);
		tick();
		expect(location.path()).toBe('/');
	}));


	it('navigate to "/room" loads RoomComponent', fakeAsync(() => {
		router.navigateByUrl('/roomname');
		tick();
		expect(location.path()).toBe('/roomname');
	}));

	it('navigate to "/changelog" loads ChangelogCompoenent', fakeAsync(() => {
		router.navigateByUrl('/changelog');
		tick();
		expect(location.path()).toBe('/changelog');
	}));

	it('navigate to "/lobby" loads LobbyComponent', fakeAsync(() => {
		router.navigateByUrl('/lobby');
		tick();
		expect(location.path()).toBe('/lobby');
	}));

	it('navigate to a page that doesnt exist redirects to /', fakeAsync(() => {
		router.navigateByUrl('/root/doesnt/exist');
		tick();
		expect(location.path()).toBe('/');
	}));

});
