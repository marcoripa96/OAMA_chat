import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { MarkdownService } from '../services/markdown/markdown.service';

/**
 * A pipe which transform text following markdown rules
 */
@Pipe({
	name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

	constructor(private _markdownService: MarkdownService) {}

	transform(value: string, mode: string = 'complete'): any {
		if (mode === 'complete') {
			return this._markdownService.renderFull(value);
		} else {
			return this._markdownService.renderSoft(value);
		}
	}

}

@NgModule({
	declarations: [MarkdownPipe],
	providers: [MarkdownService],
	exports: [MarkdownPipe]
})
export class MarkdownPipeModule { }
