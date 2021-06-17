import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { listAnimation, translateY } from '@shared/animations/animations';
import { RELEASES } from './data/changelogs';

/**
 * Components which displays the information of a version release
 */
@Component({
	selector: 'app-changelog',
	templateUrl: './changelog.component.html',
	styleUrls: ['./changelog.component.scss'],
	animations: [listAnimation, translateY],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangelogComponent implements OnInit {
	// static releases
	releases = RELEASES;

	constructor() { }

	ngOnInit() {
	}

}
