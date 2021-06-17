import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangelogModule } from './changelog.module';
import { ChangelogComponent } from './changelog.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ROUTES } from 'app/app-routes';
import { RELEASES } from './data/changelogs';

describe('ChangelogComponent', () => {
	let component: ChangelogComponent;
	let fixture: ComponentFixture<ChangelogComponent>;

	beforeEach( async () => {
		await TestBed.configureTestingModule({
			declarations: [],
			imports:[
				ChangelogModule,
				BrowserAnimationsModule,
				RouterTestingModule.withRoutes(ROUTES)
			],
			providers: []
		}).compileComponents();

		fixture = TestBed.createComponent(ChangelogComponent);
		component = fixture.componentInstance;
	});

	it('should create the component', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should render components', () => {
		fixture.detectChanges();

		const debugElement = fixture.debugElement;
		const sidebar = debugElement.query(By.css('.sidebar')).nativeElement;
		const releases = debugElement.queryAll(By.css('section .release'));

		expect(sidebar).toBeTruthy();
		expect(releases.length).toBe(RELEASES.length);
	});

});
