import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackerComponent } from './tracker.component';
import { TrackerModule } from './tracker.module';



describe('TrackerComponent', () => {
	let component: TrackerComponent;
	let fixture: ComponentFixture<TrackerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ],
			imports: [ TrackerModule ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TrackerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
