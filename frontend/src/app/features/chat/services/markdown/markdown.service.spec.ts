import { TestBed } from '@angular/core/testing';
import { MarkdownService } from './markdown.service';

describe('Service: Markdown', () => {
	let service: MarkdownService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [MarkdownService]
		});

		service = TestBed.inject(MarkdownService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should render bold', () => {
		const rendered = service.renderFull('**test**');
		expect(rendered).toBe('<strong>test</strong>');
	});

	it('should render italic', () => {
		const rendered = service.renderFull('_test_');
		expect(rendered).toBe('<em>test</em>');
	});

	it('should render italic plus bold', () => {
		const rendered = service.renderFull('_**test**_');
		expect(rendered).toBe('<em><strong>test</strong></em>');
	});

	it('should render an inline code', () => {
		const rendered = service.renderFull('`test`');
		expect(rendered).toBe('<code class="code-markdown-inline">test</code>');
	});

	it('should render an inline code success', () => {
		const rendered = service.renderFull('&success`test`');
		expect(rendered).toBe('<code class="code-markdown-inline success">test</code>');
	});

	it('should render a code block', () => {
		const rendered = service.renderFull('```\ntest\ntest\n```');
		expect(rendered).toBe('<pre class="code-markdown-block"><code>test\ntest</code></pre>');
	});

	it('should render a code block success', () => {
		const rendered = service.renderFull('&success```\ntest\ntest\n```');
		expect(rendered).toBe('<pre class="code-markdown-block success"><code>test\ntest</code></pre>');
	});

	it('should render a blockquote', () => {
		const rendered = service.renderFull('>test\n>test');
		expect(rendered).toBe('<blockquote class="quote-markdown">test<br>test</blockquote>');
	});

	it('should render an unordered list', () => {
		const rendered = service.renderFull('*test');
		expect(rendered).toBe('<ul class="tui-list">\n\t<li class="tui-list__item">test</li>\n</ul>');
	});

	it('should render an ordered list', () => {
		const rendered = service.renderFull('1.test');
		expect(rendered).toBe('<ol class="tui-list tui-list_ordered">\n\t<li class="tui-list__item">test</li>\n</ol>');
	});

	it('should render a table', () => {
		const rendered = service.renderFull('|| |test1| |test2| ||\n|test3| |test4|');
		// eslint-disable-next-line max-len
		expect(rendered).toBe('<table class="tui-table"><tr class="tui-table__tr"><th class="tui-table__th">test1</th><th class="tui-table__th">test2</th><tr class="tui-table__tr"><td class="tui-table__td">test3</td><td class="tui-table__td">test4</td></tr></tr></table>');
	});
});
