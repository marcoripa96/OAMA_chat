import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LobbyComponent } from './lobby.component';
import { LobbyModule } from './lobby.module';
import { LobbyService } from './services/lobby.service';
import { of } from 'rxjs';
import { RoomService } from '@shared/services/room/room.service';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('LobbyComponent', () => {
	let component: LobbyComponent;
	let fixture: ComponentFixture<LobbyComponent>;
	let lobbyService: LobbyService;
	let roomService: RoomService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [
			],
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
				BrowserAnimationsModule,
				LobbyModule
			],
			providers: [
				{ provide: TOKENAPI, useValue: environment.backendUrl }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(LobbyComponent);
		component = fixture.componentInstance;
		lobbyService = TestBed.inject(LobbyService);
		roomService = TestBed.inject(RoomService);


	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should create the initial form', () => {
		expect(component.form).toBeTruthy();
	});

	it('should fetch initial rooms', fakeAsync(() => {
		fixture.detectChanges();
		const expectedRes = {
			data: [
				{
					name: 'room 1',
					description: 'description test 1',
					private: false,
					stickyMessages: []
				},
				{
					name: 'room 2',
					description: 'description test 2',
					private: false,
					stickyMessages: []
				},
				{
					name: 'room 3',
					description: 'description test 3',
					private: false,
					stickyMessages: []
				}
			],
			more: true
		};

		spyOn(roomService, 'find').and.returnValue(of(expectedRes));

		component.rooms$.subscribe(res => {
			expect(res).toEqual(expectedRes);
			fixture.detectChanges();
		});

		tick(250);

		const debugElement = fixture.debugElement;
		const rooms = debugElement.queryAll(By.css('.room-action'));
		expect(rooms.length).toBe(3);

	}));

	it('should fetch more rooms', fakeAsync(() => {
		fixture.detectChanges();
		const expectedRes = {
			data: [
				{
					name: 'room 1',
					description: 'description test 1',
					private: false,
					stickyMessages: []
				},
				{
					name: 'room 2',
					description: 'description test 2',
					private: false,
					stickyMessages: []
				},
				{
					name: 'room 3',
					description: 'description test 3',
					private: false,
					stickyMessages: []
				}
			],
			more: true
		};

		const expectedTotalRes = {
			data: [...expectedRes.data, ...expectedRes.data],
			more: true
		};

		let index = 0;
		spyOn(roomService, 'find').and.returnValue(of(expectedRes));

		component.rooms$.subscribe(res => {
			if (index === 0) {
				expect(res).toEqual(expectedRes);
			} else {
				expect(res).toEqual(expectedTotalRes);
			}
			index++;
			fixture.detectChanges();
		});

		const debugElement = fixture.debugElement;

		tick(250);
		const btnMore = debugElement.query(By.css('#load-more')).nativeElement;
		btnMore.click();

	}));

	it('should fetch on search', fakeAsync(() => {
		fixture.detectChanges();
		const expectedRes = {
			data: [
				{
					name: 'room 1',
					description: 'description test 1',
					private: false,
					stickyMessages: []
				}
			],
			more: true
		};

		spyOn(roomService, 'find').and.returnValue(of(expectedRes));

		component.rooms$.subscribe(res => {
			expect(res).toEqual(expectedRes);
			fixture.detectChanges();
		});

		tick(250);
		component.form.patchValue({
			query: 'room'
		});
		tick(250);

	}));

});
