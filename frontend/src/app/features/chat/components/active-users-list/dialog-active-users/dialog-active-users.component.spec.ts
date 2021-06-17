import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogActiveUsersComponent } from './dialog-active-users.component';
import { ActiveUsersListModule } from '../active-users-list.module';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { By } from '@angular/platform-browser';

const fakeCompleteWith = (data) => data;

describe('DialogActiveUsersComponent', () => {
	let fixture: ComponentFixture<DialogActiveUsersComponent>;
	let component: DialogActiveUsersComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [],
			providers: [
				{ provide: POLYMORPHEUS_CONTEXT, useValue: {data: {users: ['A', 'B'], currentUser: 'A'}, completeWith: fakeCompleteWith} },
			],
			imports: [
				BrowserAnimationsModule,
				ActiveUsersListModule
			]
		}).compileComponents();
		// init
		fixture = TestBed.createComponent(DialogActiveUsersComponent);
		component = fixture.componentInstance;
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});

	it('should show active users', () => {
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const users = debugElement.queryAll(By.css('.username')).length;
		expect(users).toBe(2);
	});

	it('should show only typed user', () => {
		fixture.detectChanges();

		let expectedValues = ['A', 'B'];

		component.users$.subscribe(users => {
			expect(users).toEqual(expectedValues);
			expectedValues = ['A'];
		});

		component.form.patchValue({
			search: 'A'
		});
	});

	it('should dismiss dialog if user B is kicked', () => {
		spyOn(component, 'kickUser');
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const kickButton = debugElement.query(By.css('.kick-button')).nativeElement;
		kickButton.dispatchEvent(new Event('click'));
		expect(component.kickUser).toHaveBeenCalledWith('B');
	});

});
