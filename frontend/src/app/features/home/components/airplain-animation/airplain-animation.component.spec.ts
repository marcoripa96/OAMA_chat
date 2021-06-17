import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AirplainAnimationComponent } from './airplain-animation.component';
import { AirplainAnimationModule } from './airplain-animation.module';


describe('ListSliderComponent', () => {
	let component: AirplainAnimationComponent;
	let fixture: ComponentFixture<AirplainAnimationComponent>;

	beforeEach( async () => {
		await TestBed.configureTestingModule({
			declarations: [],
			imports:[
				AirplainAnimationModule,
				BrowserAnimationsModule
			],
			providers: []
		}).compileComponents();

		fixture = TestBed.createComponent(AirplainAnimationComponent);
		component = fixture.componentInstance;
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});
});
