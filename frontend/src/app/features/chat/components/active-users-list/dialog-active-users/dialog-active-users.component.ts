import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import {
	debounceTime,
	distinctUntilChanged,
	map,
	startWith
} from 'rxjs/operators';

@Component({
	selector: 'app-dialog-active-users',
	templateUrl: './dialog-active-users.component.html',
	styleUrls: ['./dialog-active-users.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogActiveUsersComponent implements OnInit {
	// emits filtered users
	users$: Observable<string[]>;
	// form controls for search bar
	form = new FormGroup({
		search: new FormControl('')
	});

	openKickDropdown = false;

	constructor(
		// inject context of dialog, so we can get data passed to the dialog
		@Inject(POLYMORPHEUS_CONTEXT)
		readonly context: TuiDialogContext<any, any>
	) { }

	ngOnInit() {
		// get users from dialog context
		const users: string[] = this.context.data.users;

		// listen for changes to search and filter users respectively
		this.users$ = this.form.get('search').valueChanges.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			map(search =>
				users.filter(user => user.toLowerCase().includes(search.toLowerCase()))
			),
			startWith(users)
		);
	}

	/**
	 * Kick user by passing username back to parent component and by closing dialog
	 */
	kickUser(user: string): void {
		this.context.completeWith(user);
	}
}
