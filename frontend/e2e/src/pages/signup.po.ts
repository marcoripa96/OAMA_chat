import { browser, by, element, ElementFinder } from 'protractor';

export class SignupPage {
	// navigate to route
	async navigateTo(): Promise<unknown> {
		return browser.get(`/signup`);
	}

	async getEmailInput(): Promise<ElementFinder> {
		return element(by.css('#email-input input'));
	}

	async getNameInput(): Promise<ElementFinder> {
		return element(by.css('#name-input input'));
	}

	async getPasswordInput(): Promise<ElementFinder> {
		return element(by.css('#password-input input'));
	}

	async getPasswordConfirmInput(): Promise<ElementFinder> {
		return element(by.css('#password-confirm-input input'));
	}

	async getSignupButton(): Promise<ElementFinder> {
		return element(by.css('#submit-signup'));
	}

	async getPasswordHint(): Promise<ElementFinder> {
		return element(by.css('#passwordHint'));
	}

	// get notification
	async getNotification(): Promise<ElementFinder> {
		return element(by.css('tui-notification :not(#passwordHint)'));
	}
}
