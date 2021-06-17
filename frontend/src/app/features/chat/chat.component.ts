import {
	HostBinding, Inject, ChangeDetectionStrategy,
	ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild,

	ViewChildren, TemplateRef, QueryList, Renderer2,  EventEmitter, Output
} from '@angular/core';
import { ChatService, DisconnectReason } from '@features/chat/services/chat/chat.service';
import { ChatMessage } from '@shared/models/message';
import { TuiNotification, TuiNotificationsService, TuiScrollbarComponent } from '@taiga-ui/core';
import { merge, Observable, of, timer } from 'rxjs';
import {
	filter,
	last, map, switchMap, takeUntil, tap
} from 'rxjs/operators';
import { RoomConfig, Visibility } from '@shared/services/room-config/room-config.service';
import { LayoutService } from '@shared/services/layout/layout.service';
import { enterScaleAnimation } from '@shared/animations/animations';
import { SidebarService } from '@shared/services/sidebar/sidebar.service';
import { InterceptorError, AckMessage } from '@shared/models/error';
import { TuiDestroyService, TuiScrollService } from '@taiga-ui/cdk';
import { MessageComponent } from './components/message/message.component';
import { AudioService } from '@shared/services/audio/audio.service';
import { StickyMessageComponent } from './components/sticky-message/sticky-message.component';
import { Router } from '@angular/router';

/**
 * Provides the chat component.
 */
@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	providers: [ChatService, TuiDestroyService],
	animations: [
		enterScaleAnimation
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
	// room configuration
	@Input() roomConfig: RoomConfig;

	// append animation to host element
	@HostBinding('@enterAnimation') get enterAnimation(): boolean {
		return true;
	}

	// get reference to scrollbar
	@ViewChild(TuiScrollbarComponent, { read: ElementRef, static: false }) scrollBar: ElementRef;

	// reference to messages DOM elements
	@ViewChildren('messagesRef', { read: ElementRef }) messagesTemplates: QueryList<ElementRef>;
	// reference to messages components
	@ViewChildren('messagesRef', { read: MessageComponent }) messagesComponents: QueryList<MessageComponent>;

	// emits stored and new messages
	messages$: Observable<ChatMessage[]>;

	// track connection status of client
	connected$: Observable<boolean>;
	// emits current active users in the room
	activeUsers$: Observable<string[]>;

	// track scrollbar visibility
	hiddenScrollbar = false;

	// reference to sticky message component
	@ViewChild(StickyMessageComponent) stickyMessageComponent: StickyMessageComponent;
	// track user actions to avoid redundant messages (e.g. 'kick' and 'leave' of the same user)
	private _previousKickedUser = '';

	constructor(
		private _chatService: ChatService,
		private _layoutService: LayoutService,
		private _sidebarService: SidebarService,
		private _renderer: Renderer2,
		private readonly _destroy$: TuiDestroyService,
		@Inject(TuiNotificationsService) private readonly _notificationsService: TuiNotificationsService,
		@Inject(TuiScrollService) private _tuiScrollService: TuiScrollService,
		private _audioService: AudioService,
		private _cdr: ChangeDetectorRef,
		private _router: Router
	) {
		this._layoutService.set({
			toolbar: 'left'
		});
	}

	ngOnInit() {

		// connect to server and join room. On error redirects.
		this.connected$ = this._chatService.connectAndJoinRoom(this.roomConfig).pipe(
			tap(ack => {
				if (!ack.success) {
					this.roomConfig.visibility = Visibility.username;
					const error: InterceptorError = {
						errorMessage: 'Error: Cannot join Room',
						resMessage: ack.message
					};

					this._notificationsService.show(error.resMessage, {
						label: error.errorMessage,
						status: TuiNotification.Error
					}).subscribe();
				}
			}),
			map(ack => ack.success),
			takeUntil(this._destroy$)
		);

		// get old messages and listen to new messages
		this.messages$ = this._chatService.getMessages(this.roomConfig.name)
			.pipe(takeUntil(this._destroy$));

		// listen to changes to active users
		this.activeUsers$ = this._chatService.getActiveUsers();

		// listen to users actions
		this._chatService.getUserAction()
			.pipe(
				takeUntil(this._destroy$),
				filter(
					userAction => {
						if (this._previousKickedUser === userAction.username) {
							if (userAction.action === 'leave-room') {
								// avoid useless notification
								return false;
							} else if (userAction.action === 'join-room') {
								// the user is no more kicked
								this._previousKickedUser = '';
								return true;
							} else {
								return true;
							}

						} else if (userAction.action === 'kick-user' && userAction.kickedUsername === this.roomConfig.username) {
							// do not show room generic kick message to the kicked user
							return false;
						} else {
							return true;
						}
					})
			)
			.subscribe((userAction) => {
				// set last kicked user to avoid redundant notificaion on leave
				if (userAction.action === 'kick-user') {
					this._previousKickedUser = userAction.kickedUsername;
				}
				// get notification message
				const userActionMessage = this.getUserActionMessage(userAction);
				// reproduce sound
				this._audioService.playSound(userAction.action);
				// show notification
				this._notificationsService.show(userActionMessage, { status: TuiNotification.Info })
					.subscribe();
			});
		// listen for new sticky messages
		this._chatService
			.getStickyMessage()
			//.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((message: ChatMessage) => {
				this.addStickyMessage(message);
				this._cdr.markForCheck();
			});

		// listen for new sticky messages
		this._chatService
			.getRemoveStickyMessage()
			//.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((message: ChatMessage) => {
				this.removeStickyMessage(message);
				this._cdr.markForCheck();
			});

		// listen to user kick
		this._chatService.getUserKick()
			.pipe(takeUntil(this._destroy$))
			.subscribe((username) => {
				// show notification
				const kickMessage = `You have been kicked from ${this.roomConfig.name} by ${username}!`;
				this._notificationsService
					.show(kickMessage, { autoClose: false, label: 'GOT KICKED!', status: TuiNotification.Error })
					.subscribe();
				// reproduce sound
				this._audioService.playSound('kick-user');
				// redirect user
				this._router.navigate(['']);
			});

		// on disconnect
		this._chatService
			.onDisconnect()
			.pipe(
				filter(reason => reason !== DisconnectReason.clientManual &&
					reason !== DisconnectReason.serverManual),
				takeUntil(this._destroy$))
			.subscribe(() => {
				const error: InterceptorError = {
					errorMessage: 'Wooops: You\'ve been disconnected. Try to reload the page.'
				};
				this._notificationsService.show(error.resMessage, { label: error.errorMessage, status: TuiNotification.Error })
					.subscribe();
			});

		// Listen for closing events of the sidebar coming from the search
		this._sidebarService.status$.pipe(
			filter(res => !res.open && res.data && res.data.from === 'search'),
			takeUntil(this._destroy$)
		).subscribe(res => this.scrollToMessage(res.data.value));
	}


	/**
	 * Send the new message
	 */
	sendMessage(message: ChatMessage) {
		// send message
		this._chatService.sendMessage(message)
			.pipe(takeUntil(this._destroy$))
			.subscribe((data: AckMessage) => {
				if (data.success) {
					// message saved successfully to db and sent to other client
					this._chatService.addMessage(data.data);
				} else {
					const error: InterceptorError = {
						errorMessage: 'Error: Cannot send Message',
						resMessage: data.message
					};

					console.error(error);
					this._notificationsService.show(error.resMessage, { label: error.errorMessage, status: TuiNotification.Error })
						.subscribe();
				}
			});
	}

	/**
	 * Scroll to a specific message and highlight it
	 */
	scrollToMessage(message: ChatMessage): void {
		const indexOfElement = this.messagesComponents.map(item => item.message._id).indexOf(message._id);

		let element: any;
		let highlightableMessage: any;

		if (indexOfElement !== -1) {
			element = this.messagesTemplates.toArray()[indexOfElement];
			highlightableMessage = this._getHighlightableElement(element.nativeElement);
		} else {
			// trigger data fetch to get messages up until the message we are looking for
		}

		const { nativeElement } = this.scrollBar;
		this._tuiScrollService.scroll$(nativeElement, element.nativeElement.offsetTop)
			.pipe(
				last(),
				switchMap(() => merge(
					of({ status: true, element: highlightableMessage }),
					timer(1000).pipe(map(() => ({ status: false, element: highlightableMessage })))
				)),
				takeUntil(this._destroy$)
			).subscribe(stat => this._highlightMessage(stat.element, stat.status));
	}

	/**
	 * Get child element which is highlightable
	 */
	private _getHighlightableElement(parentElement: any): any {
		const children = parentElement.children;
		for (const child of children) {
			if (child.classList.contains('message')) {
				return child;
			}
		}
	}

	/**
	 * Highlight a message element by applying a class
	 */
	private _highlightMessage(element: any, status: boolean): void {
		if (status) {
			this._renderer.addClass(element, 'highlighted');
		} else {
			this._renderer.removeClass(element, 'highlighted');
		}
	}

	/**
	 * TrackBack function to optimize ngFor
	 */
	identify(index, message: ChatMessage) {
		return message._id;
	}

	/**
	 * Maps number of participants to correcly display message
	 */
	getNumberText(numberOfParticipants: number): string {
		return numberOfParticipants === 1 ?
			`${numberOfParticipants} active user` : `${numberOfParticipants} active users`;
	}

	/**
	 * Toggle sidebar. A content of the sidebar should be provided
	 */
	toggleSidebar(content: TemplateRef<any>): void {
		this._sidebarService.show(content);
	}


	/**
	 * Given two messages returns if true if they are sent on a different day
	 */
	isNewDay(previousMessage: ChatMessage, currentMessage: ChatMessage): boolean {
		if (!previousMessage) {
			return true;
		}
		const previousDate = new Date(previousMessage.sentDate);
		const currentDate = new Date(currentMessage.sentDate);

		return previousDate.getFullYear() !== currentDate.getFullYear() ||
			previousDate.getMonth() !== currentDate.getMonth() ||
			previousDate.getDate() !== currentDate.getDate();
	}

	/**
	 * Converts a string corresponding to a UTC date to a Date object
	 */
	toDate(date: string): Date {
		return new Date(date);
	}

	/**
	 * Add new sticky message
	 */
	addStickyMessage(newStickyMessage: ChatMessage): void {
		this.roomConfig.room.stickyMessages = [...this.roomConfig.room.stickyMessages, newStickyMessage];
		this._cdr.markForCheck();
	}
	/**
	 * Remove sticky message
	 */
	removeStickyMessage(message: ChatMessage): void {
		this.roomConfig.room.stickyMessages = this.roomConfig.room.stickyMessages.filter(msg => message._id !== msg._id);
		this.stickyMessageComponent.activeIndex = 0;
		this._cdr.markForCheck();
	}

	/**
	 * Manage sticky message list, if sticky message doesn't exist add this sticky message
	 * otherwise remove this message from the pinned messages
	 */
	newSticky(newStickyMessage: ChatMessage): void {
		// sticky message doesn't exist --> add
		if (this.roomConfig.room.stickyMessages.findIndex(msg => newStickyMessage._id === msg._id) === -1) {
			this._chatService.sendStickyMessage(newStickyMessage)
				.pipe(takeUntil(this._destroy$))
				.subscribe((data: AckMessage) => {
					if (data.success) {
						console.log('data.success');
						// message saved successfully to db and sent to other client
						this.addStickyMessage(newStickyMessage);
					} else {
						const error: InterceptorError = {
							errorMessage: 'Error: Cannot send Message',
							resMessage: data.message
						};

						console.error(error);
						this._notificationsService.show(error.resMessage, { label: error.errorMessage, status: TuiNotification.Error })
							.subscribe();
					}
				});
		}
		else {
			// sticky message exists --> remove
			this._chatService.removeStickyMessage(newStickyMessage)
				.pipe(takeUntil(this._destroy$))
				.subscribe((data: AckMessage) => {
					if (data.success) {
						console.log('data.success');
						// message removed successfully to db and sent to other client
						this.removeStickyMessage(newStickyMessage);
						this.stickyMessageComponent.activeIndex = 0;
						this._cdr.markForCheck();
					} else {
						const error: InterceptorError = {
							errorMessage: 'Error: Cannot remove Message',
							resMessage: data.message
						};

						console.error(error);
						this._notificationsService.show(error.resMessage, { label: error.errorMessage, status: TuiNotification.Error })
							.subscribe();
					}
				});
		}
	}
	/**
	 * Return the -1 if the message isn't pinned
	 */
	getItem(message: ChatMessage): number {
		return this.roomConfig.room.stickyMessages.findIndex(msg => message._id === msg._id);
	}
	/**
	 * Kick user from the room
	 */
	kickUser(username: string) {
		this._chatService.kickUser(username, this.roomConfig.name)
			.pipe(takeUntil(this._destroy$))
			.subscribe((ack: AckMessage) => {
				if (ack.success) {
					const kickMessage = 'You kicked ' + username + '!';
					this._notificationsService.show(kickMessage).subscribe();
				} else {
					const error: InterceptorError = {
						errorMessage: 'Error: Cannot kick user ' + username,
						resMessage: ack.message
					};
					this._notificationsService.show(error.resMessage, {
						label: error.errorMessage,
						status: TuiNotification.Error
					}).subscribe();
				}
			});
	}

	/**
	 * Generate the notification message associated to a user action
	 */
	getUserActionMessage(userAction): string {
		let userActionMessage = '';
		switch (userAction.action) {
			case 'join-room':
				userActionMessage = userAction.username + ' joined the room';
				break;
			case 'leave-room':
				userActionMessage = userAction.username + ' left the room';
				break;
			case 'kick-user':
				userActionMessage = userAction.username + ' kicked ' + userAction.kickedUsername;
				break;
		}
		return userActionMessage;
	}
}
