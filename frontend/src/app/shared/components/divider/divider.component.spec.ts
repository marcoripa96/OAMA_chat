import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ROUTES } from 'app/app-routes';
import { DividerComponent } from './divider.component';
import { DividerModule } from './divider.module';


describe('DividerComponent', () => {

	let fixture: ComponentFixture<DividerComponent>;
	let component: DividerComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				DividerModule,
				RouterTestingModule.withRoutes(ROUTES)
			],
			declarations: [],
			providers: []
		}).compileComponents();

		fixture = TestBed.createComponent(DividerComponent);
		component = fixture.componentInstance;
	});

	// check if component gets instantiated
	it('should create the component', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should render divider', () => {
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		const divider = debugElement.query(By.css('.divider'));
		const dividerClasses = divider.classes;

		expect(divider.nativeElement).toBeTruthy();
		expect(Object.keys(dividerClasses)).toContain('vertical');
	});

});
