import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ScrollService } from '@shared/services/scroll/scroll.service';
import { ThemeService } from '@shared/services/theme/theme.service';
import { ROUTES } from 'app/app-routes';
import { ToolbarComponent } from './toolbar.component';
import { ToolbarModule } from './toolbar.module';


describe('ToolbarComponent', () => {

	let fixture: ComponentFixture<ToolbarComponent>;
	let themeService: ThemeService;
	let scrollService: ScrollService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ToolbarModule,
				RouterTestingModule.withRoutes(ROUTES)
			],
			declarations: [],
			providers: [
				ThemeService,
				ScrollService
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ToolbarComponent);
		themeService = TestBed.inject(ThemeService);
		scrollService = TestBed.inject(ScrollService);
	});

	// check if component gets instantiated
	it('should create the component', () => {
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
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

	it('should emit scroll height', () => {
		const component = fixture.componentInstance;
		component.scroll$.subscribe(scrollY => expect(scrollY).toBe(0));
	});

	it('should render toolbar components', () => {
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		const logo = debugElement.query(By.css('.logo')).nativeElement;
		const browseBtn= debugElement.query(By.css('.browse-btn')).nativeElement;
		const themeBtn = debugElement.query(By.css('.btn-theme')).nativeElement;
		const loginBtn = debugElement.query(By.css('.login-btn')).nativeElement;
		const signupBtn = debugElement.query(By.css('.signup-btn')).nativeElement;

		expect(logo).toBeTruthy();
		expect(browseBtn).toBeTruthy();
		expect(themeBtn).toBeTruthy();
		expect(loginBtn).toBeTruthy();
		expect(signupBtn).toBeTruthy();
	});

});
