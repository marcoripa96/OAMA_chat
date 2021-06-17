import { browser, by, element, ElementFinder } from 'protractor';

/**
 * Page App
 *
 * A page should be define to describe a section we want to test.
 * A page should contain functions to get elements DOM
 * elements or execute actions
 */
export class AppPage {
	// navigate to route '/'
	async navigateTo(): Promise<unknown> {
		return browser.get(browser.baseUrl);
	}

	// get title in h1 element
	async getTitleText(): Promise<string> {
		return element(by.css('app-root .content h1')).getText();
	}

	async getDarkThemeComponent(): Promise<ElementFinder> {
		return element(by.css('app-dark-theme'));
	}
}
