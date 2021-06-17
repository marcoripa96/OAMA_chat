import { browser, by, element, WebElement } from 'protractor';

/**
 * Room page
 */
export class RoomPage {
	// navigate to route
	async navigateTo(roomName: string): Promise<unknown> {
		return browser.get(`/${roomName}`);
	}
}
