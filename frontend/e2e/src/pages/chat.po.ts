import { browser, by, element, ElementFinder } from 'protractor';

export class ChatPage {
	/**
	 * Chat component
	 */
	async getChatComponent(): Promise<ElementFinder> {
		return element(by.css('app-chat'));
	}

	/**
	 * Send and receive feature
	 */
	async getSendButton(): Promise<ElementFinder> {
		return element(by.css('.btn-send'));
	}

	async getSentMessageDiv(): Promise<ElementFinder> {
		return element(by.css('.sent .message-content'));
	}

	async getLastSentMessageDiv(): Promise<ElementFinder> {
		return element.all(by.css('.sent .message-content')).last();
	}

	async getLastSentMessageUserDiv(): Promise<ElementFinder> {
		return element.all(by.css('.sent .username')).last();
	}

	async getReceivedMessageDiv(): Promise<ElementFinder> {
		return element(by.css('.received .message-content'));
	}

	async getLastReceivedMessageDiv(): Promise<ElementFinder> {
		return element.all(by.css('.received .message-content')).last();
	}

	async getLastReceivedMessageUserDiv(): Promise<ElementFinder> {
		return element.all(by.css('.received .username')).last();
	}

	async getNumberOfPartecipantsDiv(): Promise<ElementFinder> {
		return element(by.css('.top-bar .number-users'));
	}

	async getRoomNameDiv(): Promise<ElementFinder> {
		return element(by.css('.name'));
	}

	async getNewMessageInput(): Promise<ElementFinder> {
		return element(by.css('app-chat textarea'));
	}

	/**
	 * Active users
	 */
	async getActiveUsers(): Promise<ElementFinder> {
		return element.all(by.css('app-chat app-active-users-list tui-avatar'));
	}

	async getButtonActiveUsers(): Promise<ElementFinder> {
		return element(by.css('app-chat app-active-users-list .btn-more'));
	}

	async getActiveUsersDialog(): Promise<ElementFinder> {
		return element(by.css('app-dialog-active-users'));
	}

	async getActiveUsersDialogSearch(): Promise<ElementFinder> {
		return element(by.css('app-dialog-active-users tui-input input'));
	}
	async getUsersInList(): Promise<ElementFinder> {
		return element.all(by.css('app-dialog-active-users .username span'));
	}

	async getBtnKick(): Promise<ElementFinder> {
		return element.all(by.css('app-dialog-active-users .kick-button')).first();
	}
	/**
	 * Chat spoiler feature
	 */
	async getBtnMarkSpoiler(): Promise<ElementFinder> {
		return element(by.css('.message-options .spoiler-icon'));
	}

	async getBtnShowSpoiler(): Promise<ElementFinder> {
		return element(by.css('.message .spoiler-icon'));
	}

	async getSpoilerTitle(): Promise<ElementFinder> {
		return element(by.css('.message .spoiler-title'));
	}

	async getLastReceivedSpoilerTitle(): Promise<ElementFinder> {
		return element.all(by.css('.message .spoiler-title')).last();
	}

	async getBtnSpoilerTopic(): Promise<ElementFinder> {
		return element(by.css('.message-options .spoiler-topic-icon'));
	}

	async getSpoilerTopicInput(): Promise<ElementFinder> {
		return element(by.css('app-chat .spoiler-topic input'));
	}

	async getSpoilerTopic(): Promise<ElementFinder> {
		return element(by.css('.message tui-tag'));
	}

	/**
	 * Chat settings feature
	 */
	async getSettingsButton(): Promise<ElementFinder> {
		return element(by.css('.top-bar .settings'));
	}

	async getSidebarComponentContent(): Promise<ElementFinder> {
		return element(by.css('app-sidebar .container'));
	}

	async getThemeAccordion(): Promise<ElementFinder> {
		return element(by.css('app-sidebar #accordion-theme'));
	}

	async getDarkRadioButtonsTheme(): Promise<ElementFinder> {
		return element(by.css('#radio-group-theme'));
	}

	async getDefaultRadioButton(): Promise<ElementFinder> {
		return element(by.css('app-sidebar #default-theme-radio input'));
	}

	async getDarkRadioButton(): Promise<ElementFinder> {
		return element(by.css('app-sidebar #dark-theme-radio input'));
	}

	async getAdaptiveRadioButton(): Promise<ElementFinder> {
		return element(by.css('app-sidebar #adaptive-theme-radio input'));
	}

	async getSidebarCloseArrow(): Promise<ElementFinder> {
		return element(by.css('app-sidebar #close-arrow'));
	}

	/**
	 * Notifications
	 */
	async getNotification(): Promise<ElementFinder> {
		return element(by.css('tui-notification'));
	}

	/**
	 * Link preview feature
	 */
	async getStaticLinkPreviewReceived(): Promise<ElementFinder> {
		return element(by.css('.received .preview-wrapper.static'));
	}

	async getStaticLinkPreviewSent(): Promise<ElementFinder> {
		return element(by.css('.sent .preview-wrapper.static'));
	}

	async getDynamicLinkPreview(): Promise<ElementFinder> {
		return element(by.css('.preview-wrapper.dynamic'));
	}

	/**
	 * Search feature
	 */
	async getSearchButton(): Promise<ElementFinder> {
		return element(by.css('.top-bar .search'));
	}

	async getSearchTextOnOpen(): Promise<ElementFinder> {
		return element(by.css('app-search .default-message'));
	}

	async getSearchInputText(): Promise<ElementFinder> {
		return element(by.css('app-search .search-form tui-input input'));
	}

	async getFoundMessage(): Promise<ElementFinder> {
		return element.all(by.css('app-search .content .message')).first();
	}

	async getsearchLinksRadio(): Promise<ElementFinder> {
		return element(by.css('app-search #links-radio input'));
	}

	async getsearchSpoilersRadio(): Promise<ElementFinder> {
		return element(by.css('app-search #spoilers-radio input'));
	}

	/**
	 * Sticky Messages feature
	 */
	async getOption(): Promise<ElementFinder> {
		return element(by.css('#btn-option'));
	}
	async getMenu(): Promise<ElementFinder> {
		return element.all(by.css('#svg-menu'));
	}
	async getNextSticky(): Promise<ElementFinder> {
		return element(by.css('#sticky-messages'));
	}
}
