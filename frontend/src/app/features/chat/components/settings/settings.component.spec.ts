import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarService } from '@shared/services/sidebar/sidebar.service';
import { ThemeService } from '@shared/services/theme/theme.service';
import { SettingsComponent } from './settings.component';
import { SettingsModule } from './settings.module';


describe('SettingsComponent', () => {

	let fixture: ComponentFixture<SettingsComponent>;
	let themeService: ThemeService;
	let sidebarService: SidebarService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				BrowserAnimationsModule,
				SettingsModule
			],
			declarations: [],
			providers: [
				SidebarService,
				ThemeService
			]
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsComponent);
		themeService = TestBed.inject(ThemeService);
		sidebarService = TestBed.inject(SidebarService);
	});

	// check if component gets instantiated
	it('should create the component', () => {
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});


	it('should create the theme form', () => {
		const component = fixture.componentInstance;

		fixture.detectChanges();
		expect(component.themeForm.value).toEqual({ theme: 'default' } || { theme: 'dark' });
	});

	it('should close the sidebar if clicking arrow', () => {
		const component = fixture.componentInstance;

		const emittedValues = [true, false];
		let index = 0;

		spyOn(sidebarService, 'hide');

		sidebarService.show(null);
		fixture.detectChanges();

		sidebarService.status$.subscribe(status => {
			expect(status.open).toBe(emittedValues[index]);
			index++;
		});


		const arrowIcon = fixture.debugElement.query(By.css('#close-arrow')).nativeElement;
		arrowIcon.dispatchEvent(new Event('click'));

		expect(sidebarService.hide).toHaveBeenCalled();
	});


	it('should toggle the corresponding theme', () => {
		const component = fixture.componentInstance;

		spyOn(themeService, 'set');

		component.ngOnInit();
		fixture.detectChanges();

		component.themeForm.patchValue({
			theme: 'dark'
		});
		expect(themeService.set).toHaveBeenCalledWith('dark');

		component.themeForm.patchValue({
			theme: 'adaptive'
		});
		expect(themeService.set).toHaveBeenCalledWith('adaptive');

	});

});
