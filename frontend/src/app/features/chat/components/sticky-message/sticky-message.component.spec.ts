import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StickyMessageComponent } from './sticky-message.component';
import { StickyMessageModule } from './sticky-message.module';

describe('StickyMessageComponent', () => {
	let component: StickyMessageComponent;
	let fixture: ComponentFixture<StickyMessageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ],
			imports: [BrowserAnimationsModule, StickyMessageModule, HttpClientTestingModule ]
		})
			.compileComponents();

		fixture = TestBed.createComponent(StickyMessageComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('should add sticky messages', () =>{
		component.messages =[{content:'test1', username:'utente1',room:'test'}];
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const stickyMessage = debugElement.query(By.css('.message .message-content')).nativeElement;
		expect(stickyMessage).toBeTruthy();
		expect(stickyMessage.textContent.trim()).toBe('test1');
	});
	it('should navigate between sticky messages', () =>{
		spyOn(component.next, 'emit');
		component.messages =[{content:'test1', username:'utente1',room:'test'},
			{content:'test2', username:'utente2',room:'test'}];
		fixture.detectChanges();
		const debugElement = fixture.debugElement;
		const stickyBtn = debugElement.query(By.css('.container')).nativeElement;
		expect(stickyBtn).toBeTruthy();
		stickyBtn.click();
		expect(component.next.emit).toHaveBeenCalled();
	});
});
