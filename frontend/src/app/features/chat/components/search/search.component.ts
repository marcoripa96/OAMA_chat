import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatComponent } from '@features/chat/chat.component';
import { ChatMessage } from '@shared/models/message';
import { ChatService } from '@features/chat/services/chat/chat.service';
import { MessageService } from '@shared/services/message/message.service';
import { SidebarService } from '@shared/services/sidebar/sidebar.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { merge, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

/**
 * Component which provides a search messages functionality
 */
@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	providers: [TuiDestroyService],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('listAnimation', [
			transition(':enter', [
				query(':enter', [
					style({ opacity: 0, transform: 'translateY(20%)' }),
					stagger('30ms', animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
				])
			])
		])
	]
})
export class SearchComponent implements OnInit {

	// Search form
	searchForm = new FormGroup({
		search: new FormControl(''),
		filter: new FormControl('all')
	});

	// Observable which emits found messages after search
	messages$: Observable<ChatMessage[] | string>;

	constructor(
		private readonly _sidebarService: SidebarService,
		// inject parent component
		private readonly _chatComponent: ChatComponent,
		private readonly _messageService: MessageService,
		private readonly _destroy$: TuiDestroyService
	) { }

	/**
	 * Getter which returns the room name of parent component
	 */
	get roomName(): string {
		return this._chatComponent.roomConfig.name;
	}

	ngOnInit() {
		this.messages$ = this.searchForm.valueChanges.pipe(
			debounceTime(300),
			// define when the form value changes
			distinctUntilChanged((prev, curr) => prev.search === curr.search && prev.filter === curr.filter),
			switchMap(form => {
				if (form.search) {
					return merge(
						// start by emitting loading
						of('LOADING'),
						// emit results after search
						this._messageService.find(this.roomName, form.search, form.filter).pipe(
							catchError(() => of('EMPTY'))
						)
					);
				}
				// return empty status if search field is empty
				return of('EMPTY');
			}),
			map(res => {
				if (typeof (res) === 'string') {
					return res;
				}
				return res.data;
			}),
			startWith('EMPTY'),
			takeUntil(this._destroy$)
		);
	}

	/**
	 * Close sidebar
	 */
	closeSidebar(): void {
		this._sidebarService.hide();
	}

	/**
	 * Handle message click by closing sidebar and provide return value
	 */
	onMessageClick(message: ChatMessage): void {
		this._sidebarService.hide({ from: 'search', value: message });
	}

}
