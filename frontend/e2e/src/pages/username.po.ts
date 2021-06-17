import { by, element, ElementFinder } from 'protractor';

export class UsernamePage {

	// get username component
	async getUsernameComponent(): Promise<ElementFinder> {
		return element(by.css('app-username'));
	}

	async getUsernameInput(): Promise<ElementFinder> {
		return element(by.css('app-username tui-input input'));
	}

	// get password inpuit
	async getPasswordInput(): Promise<ElementFinder> {
		return element(by.css('app-username tui-input-password input'));
	}

	// get enter button
	async getEnterButton(): Promise<ElementFinder> {
		return element(by.css('app-username .enter-button'));
	}

	async getPageTitle(): Promise<ElementFinder> {
		return element(by.css('app-username .page-title'));
	}
}


