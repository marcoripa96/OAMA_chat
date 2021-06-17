import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarService } from '@shared/services/sidebar/sidebar.service';
import { ThemeService } from '@shared/services/theme/theme.service';
import { SidebarComponent } from './sidebar.component';
import { SidebarModule } from './sidebar.module';

@Component({
	template: `
	  <ng-template #templateTest>Something here</ng-template>
	`,
})
class TemplateComponent {
	@ViewChild('templateTest') templateRef: TemplateRef<any>;
}



describe('SidebarComponent', () => {

	let fixture: ComponentFixture<SidebarComponent>;
	let sidebarService: SidebarService;
	let themeService: ThemeService;

	let templateFixture: ComponentFixture<TemplateComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				BrowserAnimationsModule,
				SidebarModule
			],
			declarations: [
				TemplateComponent
			],
			providers: [
				SidebarService,
				ThemeService
			]
		}).compileComponents();

		fixture = TestBed.createComponent(SidebarComponent);
		templateFixture = TestBed.createComponent(TemplateComponent);
		sidebarService = TestBed.inject(SidebarService);
		themeService = TestBed.inject(ThemeService);
	});

	// check if component gets instantiated
	it('should create the component', () => {
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should not be empty', () => {
		const templateComponent = templateFixture.componentInstance;
		const debugElement = fixture.debugElement;

		sidebarService.show(templateComponent.templateRef);
		fixture.detectChanges();

		const container = debugElement.query(By.css('.container')).nativeElement;
		expect(container).toBeTruthy();
	});

	it('should set and remove opened class to host', () => {
		const component = fixture.componentInstance;
		const templateComponent = templateFixture.componentInstance;
		let hostClasses;

		sidebarService.show(templateComponent.templateRef);
		fixture.detectChanges();

		hostClasses = fixture.debugElement.classes;
		expect(hostClasses.opened).toBe(true);

		sidebarService.hide();
		fixture.detectChanges();

		hostClasses = fixture.debugElement.classes;
		expect(hostClasses.opened).toBeFalsy();
	});

	it('should close sidebar', () => {
		const component = fixture.componentInstance;
		const templateComponent = templateFixture.componentInstance;

		sidebarService.show(templateComponent.templateRef);
		fixture.detectChanges();

		sidebarService.hide();
		fixture.detectChanges();

		const hostClasses = fixture.debugElement.classes;
		expect(hostClasses.opened).toBeFalsy();
	});


	it('should close the sidebar if clicking outside', () => {
		const templateComponent = templateFixture.componentInstance;
		let hostClasses;

		sidebarService.show(templateComponent.templateRef);
		fixture.detectChanges();

		hostClasses = fixture.debugElement.classes;
		expect(hostClasses.opened).toBe(true);


		const hostElement = fixture.debugElement;
		hostElement.nativeElement.dispatchEvent(new Event('mousedown'));

		hostClasses = fixture.debugElement.classes;
		expect(hostClasses.opened).toBeFalsy();
	});
});
