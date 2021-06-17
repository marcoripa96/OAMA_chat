import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlobComponent } from './blob.component';


describe('BlobComponent', () => {

	let fixture: ComponentFixture<BlobComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [],
			declarations: [
				BlobComponent
			],
			providers: []
		}).compileComponents();

		fixture = TestBed.createComponent(BlobComponent);
	});

	// check if component gets instantiated
	it('should create the component', () => {
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should create the blob', () => {
		const component = fixture.componentInstance;
		spyOn(component, 'createBlob');
		// trigger ngOnInit
		fixture.detectChanges();

		expect(component.createBlob).toHaveBeenCalled();
	});

	it('should start the animation', () => {
		const component = fixture.componentInstance;
		spyOn(component, 'loop');
		// trigger ngOnInit
		fixture.detectChanges();

		expect(component.loop).toHaveBeenCalled();
	});

});
