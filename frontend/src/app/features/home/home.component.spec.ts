import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync, ComponentFixture, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TOKENAPI } from '@shared/tokens/token-api';
import { TuiInputComponent } from '@taiga-ui/kit';
import { ROUTES } from 'app/app-routes';
import { environment } from 'environments/environment';
import { COLORS, HomeComponent } from './home.component';
import { HomeModule } from './home.module';
import { Location } from '@angular/common';
import { RoomService } from '@shared/services/room/room.service';
import { of } from 'rxjs';

describe('HomeComponent', () => {
	let component: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;
	let roomService: RoomService;
	let router: Router;
	let location: Location;

	beforeEach( async () => {
		await TestBed.configureTestingModule({
			declarations: [],
			imports:[
				HomeModule,
				BrowserAnimationsModule,
				RouterTestingModule.withRoutes(ROUTES),
				HttpClientTestingModule
			],
			providers: [
				{ provide: TOKENAPI, useValue: environment.backendUrl }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(HomeComponent);
		component = fixture.componentInstance;
		roomService = TestBed.inject(RoomService);
		router = TestBed.inject(Router);
		location = TestBed.inject(Location);
	});

	it('should create the component', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should pause or unpause on input focus/blur', fakeAsync(() => {
		spyOn(component, 'onFocusChange');
		fixture.detectChanges();

		tick(1);

		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		const inputRoom = debugElement.query(By.directive(TuiInputComponent)).componentInstance as TuiInputComponent;
		inputRoom.focusedChange.emit(true);
		fixture.detectChanges();
		expect(component.onFocusChange).toHaveBeenCalledWith(true);

		inputRoom.focusedChange.emit(false);
		fixture.detectChanges();
		expect(component.onFocusChange).toHaveBeenCalledWith(false);
		discardPeriodicTasks();
	}));

	it('should navigate to room', fakeAsync(() => {
		spyOn(component, 'submitRoom');
		component.form.patchValue({
			roomName: 'testRoom'
		});

		fixture.detectChanges();
		tick();
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

		expect(component.submitRoom).toHaveBeenCalledWith();
		discardPeriodicTasks();
	}));

	it('should emit header colors', fakeAsync(() => {

		let index = 0;

		component.color$.subscribe(color => {
			expect(color).toBe(COLORS[index]);
			index++;
		});

		fixture.detectChanges();
		tick();
		tick(15000);
		tick(15000);

		discardPeriodicTasks();
	}));


	it('should emit if room exists or not', fakeAsync(() => {
		spyOn(roomService, 'findOne').and.returnValue(of({
			data: [{
				name: 'testRoom',
				private: false,
				stickyMessages: []
			}]
		}));

		component.room$.subscribe(res => expect(res).toBe(true));

		component.form.patchValue({
			roomName: 'testRoom'
		});

		tick(500);

		discardPeriodicTasks();
	}));

	it('should render header, sections and footer', fakeAsync(() => {
		tick();

		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		const header = debugElement.query(By.css('header')).nativeElement;
		const actions = debugElement.query(By.css('.actions-container')).nativeElement;
		const chatSlider = debugElement.query(By.css('.chat-slider')).nativeElement;
		const footer = debugElement.query(By.css('footer')).nativeElement;

		expect(header).toBeTruthy();
		expect(actions).toBeTruthy();
		expect(chatSlider).toBeTruthy();
		expect(footer).toBeTruthy();

		discardPeriodicTasks();
	}));

});
