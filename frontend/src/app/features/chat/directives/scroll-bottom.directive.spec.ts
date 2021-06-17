import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TuiScrollbarModule } from '@taiga-ui/core';
import { ScrollBottomDirective, ScrollToBottomModule } from './scroll-bottom.directive';

@Component({
	template: `
	  <tui-scrollbar appScrollBottom [scrollableContainer]="scrollableContainer">
	  	<div #scrollableContainer>
		  <h1>Test</h1>
		</div>
	  </tui-scrollbar>
	`,
})
class DummyComponent { }


describe('ScrollBottomDirective', () => {

	let fixture: ComponentFixture<DummyComponent>;
	let dummy: DummyComponent;
	let directive: DebugElement;

	beforeEach(() => {
		TestBed
			.configureTestingModule({
				imports: [
					TuiScrollbarModule,
					ScrollToBottomModule
				],
				declarations: [
					DummyComponent
				]
			})
			.compileComponents();

		fixture = TestBed.createComponent(DummyComponent);
		dummy = fixture.componentInstance;
		directive = fixture.debugElement.query(By.directive(ScrollBottomDirective));

		fixture.detectChanges();
	});

	it('should create the directive', () => {
		expect(directive).toBeTruthy();
	});

});
