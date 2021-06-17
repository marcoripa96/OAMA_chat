import { trigger, transition, useAnimation } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { slideAnimation } from '@shared/animations/animations';
import { LinkPreview } from '@shared/models/linkPreview';

@Component({
	selector: 'app-preview',
	templateUrl: './preview.component.html',
	styleUrls: ['./preview.component.scss'],
	animations: [
		trigger('enterLeaveAnimationParent', [
			transition('void => true', [
				useAnimation(slideAnimation, {
					params: {
						fromHeight: 0,
						toHeight: '*',
						fromPadding: 0,
						toPadding: '10px',
						fromOpacity: 0,
						toOpacity: 1
					}
				})
			]),
			transition(':leave', [
				useAnimation(slideAnimation, {
					params: {
						fromHeight: '*',
						toHeight: 0,
						fromPadding: '10px',
						toPadding: 0
					}
				})
			])
		]),
		trigger('enterLeaveAnimationLoading', [
			transition('void => true', [
				useAnimation(slideAnimation, {
					params: {
						fromHeight: 0,
						toHeight: '*',
						fromOpacity: 0,
						toOpacity: 1,
						timings: '150ms ease-out'
					}
				})
			])
		]),
		trigger('enterLeaveAnimationChild', [
			transition('void => true', [
				useAnimation(slideAnimation, {
					params: {
						fromHeight: '30px',
						toHeight: '*',
						fromOpacity: 0,
						toOpacity: 1
					}
				})
			]),
			transition(':leave', [
				useAnimation(slideAnimation, {
					params: {
						fromHeight: '*',
						toHeight: '0',
						fromOpacity: 0,
						toOpacity: 0,
						timings: '150ms ease-out'
					}
				})
			])
		])
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit {
	private _resetLinkPreview = false;
	// component static/dynamic modality
	@Input() mode: string;
	@Input() linkPreview: LinkPreview;
	// reset preview on requets
	@Output() resetPreview: EventEmitter<void> = new EventEmitter();
	@Input() set resetLinkPreview(value: boolean) {
		if (value !== this._resetLinkPreview) {
			this._resetLinkPreview = value;
			if (value) {
				this.linkPreview = null;
				this.resetPreview.emit();
			}
		}
	};
	@Input() loading: boolean;

	constructor() { }

	ngOnInit() {
	}

	/**
	 * Open the link in a new tab
	 */
	openLink(): void {
		window.open(this.linkPreview.url, '_blank');
	}

	/**
	 * Maps title into a shorter version if present
	 */
	shortTitle(title: string): string {
		if (title) {
			const splitted = title.split('|');
			if (splitted.length <= 1 || splitted[1] === '') {
				return title;
			}
			else {
				return splitted[1].trim();
			}
		}
	}

	/**
	 * Maps title removing shorter title if present
	 */
	longTitle(title: string): string {
		if (title) {
			const splitted = title.split('|');
			if (splitted.length <= 1 || splitted[1] === '') {
				return '';
			}
			else {
				return splitted[0].trim();
			}
		}
	}

	/**
	 * Maps title into a shorter version if present
	 */
	shortDescription(description: string): string {
		const maxLength = 250;
		if (description && description.length > maxLength) {
			return description.substr(0, maxLength) + '...';
		} else {
			return description;
		}
	}

	/**
	 * Check if animation needed
	 */
	 get playAnimation(): boolean {
		return this.mode === 'dynamic';
	  }
}
