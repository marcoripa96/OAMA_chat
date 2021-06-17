import { browser, by, element, ElementFinder, WebElement } from 'protractor';

export class CreateRoomPage {

	// get create button
	async getCreateRoomFormComponent(): Promise<ElementFinder>  {
		return element(by.css('app-create-room-form'));
	}

	// get create button
	async getCreateButton(): Promise<ElementFinder>  {
		return element(by.css('app-create-room-form .create-button'));
	}

	// get password input
	async getPasswordInput(): Promise<ElementFinder>  {
		return element(by.css('app-create-room-form tui-input-password input'));
	}

	// get persistence toggle
	async getPersistenceToggle(): Promise<ElementFinder>  {
		return element(by.css('app-create-room-form tui-toggle'));
	}

	// get error notification
	async getErrorNotification(): Promise<ElementFinder> {
		return element(by.css('app-create-room-form tui-notification'));
	}

}
