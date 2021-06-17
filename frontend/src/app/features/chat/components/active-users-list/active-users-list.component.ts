import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Inject,
	Injector,
	Input,
	OnInit,
	Output
} from '@angular/core';
import { enterScaleAnimation } from '@shared/animations/animations';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { DialogActiveUsersComponent } from './dialog-active-users/dialog-active-users.component';

/**
 * Provides a list of users avatar.
 */
@Component({
	selector: 'app-active-users-list',
	templateUrl: './active-users-list.component.html',
	styleUrls: ['./active-users-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		enterScaleAnimation
	]
})
export class ActiveUsersListComponent implements OnInit {
	// all active users
	@Input() users: string[] = [];
	// current active users
	@Input() currentUser: string;
	// event to trigger kick user in the parent component
	@Output() kick: EventEmitter<string> = new EventEmitter();

	constructor(
		@Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
		@Inject(Injector) private readonly injector: Injector
	) { }

	ngOnInit() {

	}

	/**
	 * Opens dialog with all users
	 */
	openDialog(): void {
		// instantiate dialog with data to be passed to
		const dialog$ = this.dialogService.open<string>(
			new PolymorpheusComponent(DialogActiveUsersComponent, this.injector),
			{ dismissible: true, data: {users: this.users, currentUser: this.currentUser}, closeable: false }
		);
		// open dialog and listen for on close changes with data
		dialog$.subscribe({
			next: data => {
				// emit to parent component
				this.kick.emit(data);
			}
		});
	}

	/**
	 * Get top n items of an array
	 */
	getTop(array: string[], n: number = 6): string[] {
		return array.slice(0, n);
	}

	/**
	 * Get n remaining items excluding nTop items
	 */
	getRemaining(array: string[], nTop: number = 6): number {
		return array.slice(nTop, array.length).length;
	}
}
