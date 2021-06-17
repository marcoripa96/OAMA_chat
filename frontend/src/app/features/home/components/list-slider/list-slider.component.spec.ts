import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListSliderComponent } from './list-slider.component';
import { ListSliderModule } from './list-slider.module';
import { MESSAGES } from './data/messages';

describe('ListSliderComponent', () => {
	let component: ListSliderComponent;
	let fixture: ComponentFixture<ListSliderComponent>;

	beforeEach( async () => {
		await TestBed.configureTestingModule({
			declarations: [],
			imports:[
				ListSliderModule,
				BrowserAnimationsModule
			],
			providers: []
		}).compileComponents();

		fixture = TestBed.createComponent(ListSliderComponent);
		component = fixture.componentInstance;
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should render messages', () => {
		fixture.detectChanges();

		expect(component.messages.length).toBe(MESSAGES.length);

		const debugElement = fixture.debugElement;
		const messages = debugElement.queryAll(By.css('.message'));

		expect(messages.length).toBe(MESSAGES.length);
	});

	it('should restart animation', () => {
		fixture.detectChanges();

		const initalAnimStatus = component.messages[0].toggleAnimation;
		component.animationDone(component.messages[0]);
		fixture.detectChanges();

		expect(component.messages[0].toggleAnimation).toBe(!initalAnimStatus);
	});


});
