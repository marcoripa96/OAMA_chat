import { browser, by, element, ElementFinder, WebElement } from 'protractor';

/**
 * Homepage
 */
export class Homepage {
	// navigate to route
	async navigateTo(): Promise<unknown> {
		return browser.get(`/`);
	}

	async getActionChangelog(): Promise<ElementFinder> {
		return element(by.css('#action-changelog'));
	}

	async getActionLobby(): Promise<ElementFinder> {
		return element(by.css('app-home #action-lobby'));
	}

	async getActionSignup(): Promise<ElementFinder> {
		return element(by.css('app-home #action-signup'));
	}

	async getSubtitle(): Promise<ElementFinder> {
		return element(by.css('app-home .header-headline .subtitle'));
	}

	async getBtnBrowseLobby(): Promise<ElementFinder> {
		return element(by.css('app-toolbar .browse-btn'));
	}

	async getBtnLogin(): Promise<ElementFinder> {
		return element(by.css('app-toolbar .login-btn'));
	}

	async getBtnSignup(): Promise<ElementFinder> {
		return element(by.css('app-toolbar .signup-btn'));
	}

	async getBtnTheme(): Promise<ElementFinder> {
		return element(by.css('app-toolbar .btn-theme'));
	}

	async getDefaultRadioButton(): Promise<ElementFinder> {
		return element(by.css('#default-theme-radio input'));
	}

	async getDarkRadioButton(): Promise<ElementFinder> {
		return element(by.css('#dark-theme-radio input'));
	}

	async getAdaptiveRadioButton(): Promise<ElementFinder> {
		return element(by.css('#adaptive-theme-radio input'));
	}

}
