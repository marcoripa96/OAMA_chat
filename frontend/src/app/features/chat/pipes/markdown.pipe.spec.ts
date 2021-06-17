import { TestBed } from '@angular/core/testing';
import { MarkdownService } from '../services/markdown/markdown.service';
import { MarkdownPipe, MarkdownPipeModule } from './markdown.pipe';


describe('ToFormattedDate', () => {
	let pipe: MarkdownPipe;
	let service: MarkdownService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [MarkdownPipeModule]
		});
		service = TestBed.inject(MarkdownService);
		pipe = new MarkdownPipe(service);
	});

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('should render markdown fully', () => {
		spyOn(service, 'renderFull');
		const markdown = '**test**';

		const rendered = pipe.transform(markdown);
		expect(service.renderFull).toHaveBeenCalledWith(markdown);
	});

	it('should render markdown partiallu', () => {
		spyOn(service, 'renderSoft');
		const markdown = '**test**';

		const rendered = pipe.transform(markdown, 'partially');
		expect(service.renderSoft).toHaveBeenCalledWith(markdown);
	});
});
