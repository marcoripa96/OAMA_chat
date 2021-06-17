import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActiveUsersListModule } from '../active-users-list/active-users-list.module';
import { By } from '@angular/platform-browser';
import { ActiveUsersListComponent } from './active-users-list.component';
import { TuiDialogService } from '@taiga-ui/core';


describe('ActiveUsersListComponent', () => {
	let fixture: ComponentFixture<ActiveUsersListComponent>;
	let component: ActiveUsersListComponent;
	let dialogService: TuiDialogService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [],
			providers: [
				TuiDialogService
			],
			imports: [
				BrowserAnimationsModule,
				ActiveUsersListModule
			]
		}).compileComponents();
		// init
		fixture = TestBed.createComponent(ActiveUsersListComponent);
		component = fixture.componentInstance;
		dialogService = TestBed.inject(TuiDialogService);

		component.users = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
		component.currentUser = 'A';
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});

	it('should get first six users', () => {
		fixture.detectChanges();
		const top6 = component.getTop(component.users);
		expect(top6).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
	});

	it('should show first six user avatars', () => {
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const avatars = debugElement.queryAll(By.css('tui-avatar'));
		expect(avatars.length).toEqual(6);
	});

	it('should get remaining number of users', () => {
		fixture.detectChanges();
		const remaining = component.getRemaining(component.users);
		expect(remaining).toBe(1);
	});

	it('should open the dialog with all the users', () => {
		spyOn(component, 'openDialog');
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const buttonDialog = debugElement.query(By.css('.btn-more')).nativeElement;
		buttonDialog.dispatchEvent(new Event('click'));
		expect(component.openDialog).toHaveBeenCalled();
	});

});
