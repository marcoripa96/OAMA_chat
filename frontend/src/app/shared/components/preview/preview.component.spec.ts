import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';
import { TuiLoaderModule } from '@taiga-ui/core';
import { PreviewComponent } from './preview.component';



describe('PreviewComponent', () => {

	let fixture: ComponentFixture<PreviewComponent>;
	let component: PreviewComponent;


	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				TuiMapperPipeModule,
				BrowserAnimationsModule,
				TuiLoaderModule
			],
			declarations: [
				PreviewComponent
			],
			providers: [
			]
		}).compileComponents();

		fixture = TestBed.createComponent(PreviewComponent);
		component = fixture.componentInstance;
	});

	// check if component gets instantiated
	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should show link preview', () => {
		// set data
		const linkPreview = {
			url: 'test_url',
			title: 'test_title',
			description: 'test_description',
			image: 'test_image'
		};
		component.linkPreview = linkPreview;
		component.loading = false;
		// check correctness
		component.ngOnInit();
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const divPreview = debugElement.query(By.css('.preview-wrapper'));
		expect(divPreview).toBeTruthy();

	});

	it('should not show link preview', () => {
		// set data
		const linkPreview1 = null;
		component.linkPreview = linkPreview1;
		component.loading = false;
		// check correctness
		component.ngOnInit();
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const divPreview1 = debugElement.query(By.css('.preview-wrapper'));
		expect(divPreview1).toBeFalsy();
	});

	it('should show loading preview in \'dynamic\' mode', () => {
		// set data
		const linkPreview = {
			url: 'test_url',
			title: 'test_title',
			description: 'test_description',
			image: 'test_image'
		};
		component.linkPreview = linkPreview;
		component.loading = true;
		// check correctness
		component.ngOnInit();
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const divPreview = debugElement.query(By.css('.loading-wrapper'));
		expect(divPreview).toBeTruthy();
	});

	it('should map short title', () => {
		// set data
		const longTitle = 'test_long_title';
		const shortTitle = 'test_short_title';
		const linkPreview = {
			url: 'test_url',
			title: longTitle + ' | ' + shortTitle,
			description: 'test_description',
			image: 'test_image'
		};
		// check correctness
		expect(component.shortTitle(linkPreview.title)).toBe(shortTitle);
	});

	it('should map long title', () => {
		// set data
		const longTitle = 'test_long_title';
		const shortTitle = 'test_short_title';
		const linkPreview = {
			url: 'test_url',
			title: longTitle + ' | ' + shortTitle,
			description: 'test_description',
			image: 'test_image'
		};
		// check correctness
		expect(component.longTitle(linkPreview.title)).toBe(longTitle);
	});

	it('should map short description', () => {
		// set data
		const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
		 sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
		 Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
		 aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
		 voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
		 Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
		const linkPreview = {
			url: 'test_url',
			title: 'test_title',
			description,
			image: 'test_image'
		};
		// check correctness
		const shortDescription = component.shortDescription(linkPreview.description);
		expect(shortDescription.length).toBeLessThan(description.length);
		expect(shortDescription.endsWith('...')).toBeTrue();
	});

	it('should use mapper to render preview text', () => {
		// set data
		const linkPreview = {
			url: 'test_url',
			title: 'test_long_title | test_short_title',
			description: 'test_description',
			image: 'test_image'
		};
		component.linkPreview = linkPreview;
		component.loading = false;
		// check correctness
		component.ngOnInit();
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const shortTitle = debugElement.query(By.css('.short-title-preview')).nativeElement.textContent.trim();
		expect(shortTitle).toBe(component.shortTitle(linkPreview.title));
		const longTitle = debugElement.query(By.css('.long-title-preview')).nativeElement.textContent.trim();
		expect(longTitle).toBe(component.longTitle(linkPreview.title));
		const description = debugElement.query(By.css('.description-preview')).nativeElement.textContent.trim();
		expect(description).toBe(component.shortDescription(linkPreview.description));
	});

});
