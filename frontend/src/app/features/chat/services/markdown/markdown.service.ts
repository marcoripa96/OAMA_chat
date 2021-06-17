import { Injectable } from '@angular/core';

/**
 * A Service which parses markdown text
 */
@Injectable()
export class MarkdownService {

	// Markdown rules
	private readonly _rules = [
		// headers ## | #
		{ id: 'header', regex: /(#+)(.*)/g, replacementFull: this._header, replacementPartial: this._headerSoft },
		// bold **word** | __word__
		{ id: 'bold', regex: /(\*\*|__)(.*?)\1/g, replacementFull: this._strong, replacementPartial: this._strong },
		// emphasis *word* | _word_
		{ id: 'emphasis', regex: /(\*|_)(.*?)\1/g, replacementFull: this._emph, replacementPartial: this._emph },
		// del ~~word~~
		{ id: 'del', regex: /\~\~(.*?)\~\~/g, replacementFull: '<del>$1</del>', replacementPartial: '<del>$1</del>' },
		// multiline code ```\nline\nline\n```
		{
			id: 'code-block', regex: /```\n((.*?)\n)+```/g, replacementFull: this._multiCode,
			replacementPartial: this._multiCodeSoft
		},
		// inline code`word`
		{
			id: 'code-inline', regex: /`(.*?)`/g, replacementFull: '<code class="code-markdown-inline">$1</code>',
			replacementPartial: '<code class="code-markdown-inline">$1</code>'
		},
		// unordered list *word | * word
		{ id: 'ul', regex: /\n\*((?=.*\S).*)/g, replacementFull: this._ulList, replacementPartial: this._ulListSoft },
		// ordered list 1.word | 1. word
		{ id: 'ol', regex: /\n[0-9]+\.((?=.*\S).*)/g, replacementFull: this._olList, replacementPartial: this._olListSoft },
		// codeblock > word
		{
			id: 'codeblock', regex: /\n(&gt;|\>)(.*)/g, replacementFull: this._blockquote,
			replacementPartial: this._blockquoteSoft
		},
		// table header:|| |word| || table row:\n \word\
		{
			id: 'table', regex: /\|\| (\|.*\|)+ \|\|(\n\|.*\|)+/g, replacementFull: this._table,
			replacementPartial: this._tableSoft
		},
		// remove extra ul
		{ id: 'extra-ul', regex: /<\/ul>\s?<ul.+>/g, replacementFull: '', replacementPartial: '' },
		// remove extra ol
		{ id: 'extra-ol', regex: /<\/ol>\s?<ol.+>/g, replacementFull: '', replacementPartial: '' },
		// remove extra blockquotes
		{
			id: 'extra-block', regex: /<\/blockquote>\n?\s?<blockquote class=\"quote-markdown\">/g,
			replacementFull: '<br>', replacementPartial: ''
		},
		// remove extra code block
		{
			id: 'extra-code', regex: /<\/code>\n?\s?<code class=\"code-markdown-inline\">/g,
			replacementFull: '<br>', replacementPartial: ' '
		},
		// add color to inline code &success`code`
		{
			id: 'add-color-inline-code', regex: /&(warn|error|success)(<code class=\"code-markdown-inline\">)/g,
			replacementFull: this._addColorInlineCode, replacementPartial: '<code class=\"code-markdown-inline $1\">'
		},
		// add color to inline code &success```code```
		{
			id: 'add-color-block-code', regex: /&(warn|error|success)(<pre class=\"code-markdown-block\"><code>)/g,
			replacementFull: this._addColorBlockCode, replacementPartial: '<code class=\"code-markdown-inline $1\">'
		}
	];

	constructor() { }

	/**
	 * Render fully multi line code
	 */
	private _multiCode(text: string, _: string, __: string) {
		const splitted = text.split('\n');
		const lines = splitted.slice(1, splitted.length - 1);
		return `<pre class="code-markdown-block"><code>${lines.join('\n')}</code></pre>`;
	}
	/**
	 * Render partially multi line code
	 */
	private _multiCodeSoft(text: string, _: string, __: string) {
		const splitted = text.split('\n');
		const lines = splitted.slice(1, splitted.length - 1);
		return `<code class="code-markdown-inline">${lines.join(' ')}</code>`;
	}

	/**
	 * Render inline code with color
	 */
	private _addColorInlineCode(text: string, color: string, tag: string) {
		return `<code class="code-markdown-inline ${color}">`;
	}

	/**
	 * Render code block with color
	 */
	private _addColorBlockCode(text: string, color: string, tag: string) {
		return `<pre class="code-markdown-block ${color}"><code>`;
	}

	/**
	 * Render fully unordered list
	 */
	private _ulList(text: string, item: string) {
		return `\n<ul class="tui-list">\n\t<li class="tui-list__item">${item.trim()}</li>\n</ul>`;
	}
	/**
	 * Render partially unordered list (for sticky message)
	 */
	private _ulListSoft(text: string, item: string) {
		return `&#9679; ${item.trim()}`;
	}

	/**
	 * Render fully ordered list
	 */
	private _olList(text: string, item: string) {
		return `\n<ol class="tui-list tui-list_ordered">\n\t<li class="tui-list__item">${item.trim()}</li>\n</ol>`;
	}
	/**
	 * Render partially ordered list (for sticky message)
	 */
	private _olListSoft(text: string, item: string) {
		return `&#9679; ${item.trim()}`;
	}

	/**
	 * Render fully blockquote
	 */
	private _blockquote(text: string, tmp: string, item: string) {
		return `\n<blockquote class="quote-markdown">${item.trim()}</blockquote>`;
	}
	/**
	 * Render partially blockquote (for sticky message)
	 */
	private _blockquoteSoft(text: string, tmp: string, item: string) {
		return `<code class="code-markdown-inline">${item.trim()}</code>`;
	}

	/**
	 * Render fully header
	 */
	private _header(text: string, chars: string, content: string) {
		const level = chars.length;
		// if more thatn level 2 set it to level 2
		return `<div class="tui-text_h${level > 2 ? 6 : 4 + level}">${content.trim()}</div>`;
	}
	/**
	 * Render partially header (for sticky message)
	 */
	private _headerSoft(text: string, chars: string, content: string) {
		return `<strong>${content}: </strong>`;
	}

	/**
	 * Render fully bold
	 */
	private _strong(text: string, markdown: string, content: string) {
		return text.includes('tui-table__') ? text : `<strong>${content}</strong>`;
	}

	/**
	 * Render fully italic
	 */
	private _emph(text: string, markdown: string, content: string) {
		return `<em>${content}</em>`;
	}

	/**
	 * Render fully table
	 */
	private _table(text: string, header: string) {
		// get header
		const headerItems = header.split('|').filter(str => str !== ' ' && str !== '');
		// get rows
		const rows = text.split('\n').slice(1);

		let table = '<table class="tui-table"><tr class="tui-table__tr">';

		headerItems.forEach(headerItem => {
			table += `<th class="tui-table__th">${headerItem}</th>`;
		});

		rows.forEach(row => {
			const rowItems = row.split('|').filter(str => str !== ' ' && str !== '');
			table += `<tr class="tui-table__tr">`;

			rowItems.forEach(item => {
				table += `<td class="tui-table__td">${item}</td>`;
			});

			table += '</tr>';
		});

		table += '</tr></table>';
		return table;
	}

	/**
	 * Render partially table (for sticky message)
	 */
	private _tableSoft(text: string, header: string) {
		const headerItems = header.split('|').filter(str => str !== ' ' && str !== '');

		return `Table: ${headerItems.join(', ')}`;
	}

	/**
	 * Render text following all rules
	 */
	renderFull(text: string) {
		text = `\n${text}\n`;
		this._rules.forEach(rule => {
			text = (text as any).replace(rule.regex, rule.replacementFull);
		});
		return text.trim();
	}

	/**
	 * Render partially for sticky message preview
	 */
	renderSoft(text: string) {
		text = `\n${text}\n`;
		this._rules.forEach(rule => {
			text = (text as any).replace(rule.regex, rule.replacementPartial);
		});
		return text.trim();
	}
}
