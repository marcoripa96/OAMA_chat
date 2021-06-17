import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { listAnimationFast, translateY } from '@shared/animations/animations';
import { ScrollService } from '@shared/services/scroll/scroll.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { LobbyService } from './services/lobby.service';

/**
 * A component which displays a list of room with search possibility
 */
@Component({
	selector: 'app-lobby',
	templateUrl: './lobby.component.html',
	styleUrls: ['./lobby.component.scss'],
	animations: [listAnimationFast, translateY],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LobbyComponent implements OnInit {

	// get form from service.
	// the form is initialized in the service so that logic related to it isn't
	// written inside the component
	form: FormGroup = this._lobbyService.getForm();

	// emits RoomResponses related to a query
	readonly rooms$ = this._lobbyService.getRooms();
	// emits true if scrolled down false otherwise (used to display or hide scroll up button)
	readonly scroll$ = this._scrollService.scroll$.pipe(
		map(position => position > 150 ? true : false),
		distinctUntilChanged()
	);

	constructor(
		private readonly _lobbyService: LobbyService,
		private readonly _scrollService: ScrollService
	) { }

	ngOnInit() {}

	/**
	 * Getter for query form field
	 */
	get query(): FormControl {
		return this.form.get('query') as FormControl;
	}

	/**
	 * Fetch more rooms related to a previous query
	 */
	fetchMore() {
		this._lobbyService.fetchMore();
	}

}
