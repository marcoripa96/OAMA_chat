import { browser, by, element, ElementFinder } from 'protractor';

export class LobbyPage {
	// navigate to route
	async navigateTo(): Promise<unknown> {
		return browser.get(`/lobby`);
	}

	async getRooms(): Promise<ElementFinder> {
		return element.all(by.css('.room-action'));
	}

	async getSearchInput(): Promise<ElementFinder> {
		return element(by.css('.search-input input'));
	}

	async btnScrollTop(): Promise<ElementFinder> {
		return element(by.css('app-scroll-top button'));
	}

	async getRoomTitles(): Promise<ElementFinder> {
		return element.all(by.css('.room-action .action-title'));
	}

	async btnLoadMore(): Promise<ElementFinder> {
		return element(by.css('#load-more'));
	}
}
