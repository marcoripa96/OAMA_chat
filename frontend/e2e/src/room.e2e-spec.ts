import { browser, protractor, ProtractorExpectedConditions } from 'protractor';
import { AppPage } from './pages/app.po';
import { ChatPage } from './pages/chat.po';
import { CreateRoomPage } from './pages/create-room.po';
import { RoomPage } from './pages/room.po';
import { UsernamePage } from './pages/username.po';


describe('Create Room page', () => {
	let appPage: AppPage;
	let roomPage: RoomPage;
	let createRoomPage: CreateRoomPage;
	let usernamePage: UsernamePage;
	let chatPage: ChatPage;
	let EC: ProtractorExpectedConditions;

	const getRandomString = (prefix: string, length: number): string => {
		const result = [];
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result.push(characters.charAt(Math.floor(Math.random() *
				charactersLength)));
		}
		return prefix + result.join('');
	};


	beforeEach(async () => {
		appPage = new AppPage();
		roomPage = new RoomPage();
		createRoomPage = new CreateRoomPage();
		usernamePage = new UsernamePage();
		chatPage = new ChatPage();

		EC = protractor.ExpectedConditions;
	});

	const room0 = getRandomString('e2eTestRoom0', 10);
	const room1 = getRandomString('e2eTestRoom1', 10);
	const room2 = getRandomString('e2eTestRoom2', 10);
	const room3 = getRandomString('e2eTestRoom3', 10);
	const room4 = getRandomString('e2eTestRoom4', 10);
	const room5 = getRandomString('e2eTestRoom5', 10);

	const user0 = getRandomString('e2eUser0', 10);
	const user1 = getRandomString('e2eUser1', 10);
	const user2 = getRandomString('e2eUser2', 10);
	const user3 = getRandomString('e2eUser3', 10);

	const content0 = 'content test sent';
	const content1 = 'content test received';

	const contentUrl0 = 'content test sent with www.google.com link';
	const contentUrl1 = 'content test received with www.google.com link';

	/**
	 * Create room
	 */
	it('should create a new public transient room', async () => {
		const roomName = room0;
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);
		await browser.sleep(1000);
	});

	/**
	 * Create room
	 */
	it('should create a new public persistent room', async () => {
		const roomName = room1;
		await roomPage.navigateTo(roomName);
		// get persistence toggle
		const persistenceToggle = await createRoomPage.getPersistenceToggle();
		// make room persistent
		persistenceToggle.click();
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);
	});

	it('should create a new private transient room', async () => {
		const roomName = room2;
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// get password input
		const passwordInput = await createRoomPage.getPasswordInput();
		// type an invalid password
		await passwordInput.click();
		await passwordInput.clear();
		await passwordInput.sendKeys('pass');

		// if an invalid password (shortert than 6 chars), a error notification is shown
		const errorNotification = await createRoomPage.getErrorNotification();
		expect(await errorNotification.isPresent()).toBe(true);

		// type a valid password
		await passwordInput.click();
		await passwordInput.clear();
		await passwordInput.sendKeys('password');
		// wait for notification to be invisible since the password is valid
		await browser.wait(EC.invisibilityOf(errorNotification));
		expect(await errorNotification.isPresent()).toBe(false);

		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		await browser.wait(EC.visibilityOf(usernameComponent));
		expect(await usernameComponent.isPresent()).toBe(true);
	});

	it('should create a new private persistent room', async () => {
		const roomName = room3;
		await roomPage.navigateTo(roomName);
		// get persistence toggle
		const persistenceToggle = await createRoomPage.getPersistenceToggle();
		// make room persistent
		persistenceToggle.click();
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// get password input
		const passwordInput = await createRoomPage.getPasswordInput();
		// type an invalid password
		await passwordInput.click();
		await passwordInput.clear();
		await passwordInput.sendKeys('pass');

		// if an invalid password (shortert than 6 chars), a error notification is shown
		const errorNotification = await createRoomPage.getErrorNotification();
		await browser.wait(EC.visibilityOf(errorNotification));
		expect(await errorNotification.isPresent()).toBe(true);

		// type a valid password
		await passwordInput.click();
		await passwordInput.clear();
		await passwordInput.sendKeys('password');
		// wait for notification to be invisible since the password is valid
		await browser.wait(EC.invisibilityOf(errorNotification));
		expect(await errorNotification.isPresent()).toBe(false);

		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		await browser.wait(EC.visibilityOf(usernameComponent));
		expect(await usernameComponent.isPresent()).toBe(true);
		await browser.sleep(1000);
	});

	/**
	 * Access transient room
	 */
	it('should access a public transient room', async () => {
		const roomName = room0;
		await roomPage.navigateTo(roomName);

		// the room should exists so the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// it is a public room, so the password input shouldn't be visible
		const passwordInput = await usernamePage.getPasswordInput();
		expect(await passwordInput.isPresent()).toBe(false);

		// get enter button
		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));
		expect(await chatComponent.isPresent()).toBe(true);
	});

	/**
	 * Second Access transient room
	 * Room should not exist anymore
	 * Sometimes it fails on the CI pipeline, leave it commented
	 */
	// it('should not access a public transient room', async () => {
	// 	const roomName = room0;
	// 	await roomPage.navigateTo(roomName);
	// 	await browser.sleep(2000);
	// 	await browser.waitForAngularEnabled(false);

	// 	// the room should not exist so the create room component is shown
	// 	const roomCreateComponent = await createRoomPage.getCreateRoomFormComponent();
	// 	expect(await roomCreateComponent.isPresent()).toBe(true);
	// 	await browser.sleep(1500);
	// 	await browser.waitForAngularEnabled(true);
	// });

	/**
	 * Access room
	 */
	it('should access a public persistent room', async () => {
		const roomName = room1;
		await roomPage.navigateTo(roomName);

		// the room should exists so the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// it is a public room, so the password input shouldn't be visible
		const passwordInput = await usernamePage.getPasswordInput();
		expect(await passwordInput.isPresent()).toBe(false);

		// get enter button
		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));
		expect(await chatComponent.isPresent()).toBe(true);
		await browser.sleep(1000);
	});

	/**
	 * Access room
	 */
	it('should access a public persistent room twice', async () => {
		const roomName = room1;
		await roomPage.navigateTo(roomName);

		// the room should exists so the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// it is a public room, so the password input shouldn't be visible
		const passwordInput = await usernamePage.getPasswordInput();
		expect(await passwordInput.isPresent()).toBe(false);

		// get enter button
		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));
		expect(await chatComponent.isPresent()).toBe(true);
	});

	it('should access a private transient room', async () => {
		const roomName = room2;
		await roomPage.navigateTo(roomName);

		// the room should exists so the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// it is a prvate room, so the password input should be visible
		const passwordInput = await usernamePage.getPasswordInput();
		expect(await passwordInput.isPresent()).toBe(true);

		// type valid passowrd
		await passwordInput.click();
		await passwordInput.clear();
		await passwordInput.sendKeys('password');

		await browser.wait(async () => await passwordInput.getAttribute('value') === 'password', 5000);

		// get enter button
		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));
		expect(await chatComponent.isPresent()).toBe(true);
	});

	it('should not access a private transient room twice', async () => {
		const roomName = room2;
		await roomPage.navigateTo(roomName);

		// the room should not exist so the create room component is shown
		const roomCreateComponent = await createRoomPage.getCreateRoomFormComponent();
		await browser.waitForAngularEnabled(false);
		expect(await roomCreateComponent.isPresent()).toBe(true);
		await browser.sleep(1500);
		await browser.waitForAngularEnabled(true);
	});

	it('should access a private persistent room', async () => {
		const roomName = room3;
		await roomPage.navigateTo(roomName);

		// the room should exists so the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// it is a prvate room, so the password input should be visible
		const passwordInput = await usernamePage.getPasswordInput();
		expect(await passwordInput.isPresent()).toBe(true);

		// type valid passowrd
		await passwordInput.click();
		await passwordInput.clear();
		await passwordInput.sendKeys('password');

		await browser.wait(async () => await passwordInput.getAttribute('value') === 'password', 5000);

		// get enter button
		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));
		expect(await chatComponent.isPresent()).toBe(true);
	});

	it('should access a private persistent room twice', async () => {
		const roomName = room3;
		await roomPage.navigateTo(roomName);

		// the room should exists so the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// it is a prvate room, so the password input should be visible
		const passwordInput = await usernamePage.getPasswordInput();
		expect(await passwordInput.isPresent()).toBe(true);

		// type valid passowrd
		await passwordInput.click();
		await passwordInput.clear();
		await passwordInput.sendKeys('password');

		await browser.wait(async () => await passwordInput.getAttribute('value') === 'password', 5000);

		// get enter button
		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));
		expect(await chatComponent.isPresent()).toBe(true);
		await browser.sleep(1000);
	});

	/**
	 * Chat
	 */
	it('should send message', async () => {
		// create transient room
		const roomName = getRandomString('e2eroomB', 10);
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(getRandomString('e2eUser', 10));

		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));
		expect(await chatComponent.isPresent()).toBe(true);

		// insert text
		const content = 'content test';
		const newMessage = await chatPage.getNewMessageInput();
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys(content);
		await browser.wait(async () => await newMessage.getAttribute('value') === content, 5000);
		// send message
		const btnSend = await chatPage.getSendButton();
		await btnSend.click();
		await browser.sleep(1000);

		// get rendered text
		const divMessageSent = await chatPage.getLastSentMessageDiv();
		const messageSentText = await divMessageSent.getText();
		expect(messageSentText.startsWith(content)).toBe(true);
		await browser.sleep(1000);

	});

	it('should send and receive message in a transient room', async () => {
		// create transient room

		const roomName = getRandomString('e2eroomA', 10);
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		const contentSent = content0;
		const contentReceived = content1;

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(user0);

		const enterButton1 = await usernamePage.getEnterButton();
		await enterButton1.click();

		const chatComponent1 = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent1));
		expect(await chatComponent1.isPresent()).toBe(true);

		// insert text
		const newMessage = await chatPage.getNewMessageInput();
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys(contentSent);
		await browser.wait(async () => await newMessage.getAttribute('value') === contentSent, 5000);
		// send message
		const btnSend = await chatPage.getSendButton();
		await btnSend.click();
		await browser.sleep(1000);

		// get rendered text
		const divMessageSent = await chatPage.getLastSentMessageDiv();
		const messageSentText = await divMessageSent.getText();
		expect(messageSentText.startsWith(contentSent)).toBe(true);

		const divMessageSentUser = await chatPage.getLastSentMessageUserDiv();
		const sentUserText = await divMessageSentUser.getText();
		expect(sentUserText).toBe(user0);

		// start a second client in a new tab
		await browser.executeScript(`window.open('')`);
		await browser.getAllWindowHandles().then(async handles => {
			await browser.switchTo().window(handles[1]).then(async () => {
				await roomPage.navigateTo(roomName);
				// access room
				const usernameInput2 = await usernamePage.getUsernameInput();
				await usernameInput2.click();
				await usernameInput2.clear();
				await usernameInput2.sendKeys(user1);

				const enterButton2 = await usernamePage.getEnterButton();
				await enterButton2.click();

				const chatComponent2 = await chatPage.getChatComponent();
				await browser.wait(EC.visibilityOf(chatComponent2));

				// send a new message from the second client
				const newMessage2 = await chatPage.getNewMessageInput();
				await newMessage2.click();
				await newMessage2.clear();
				await newMessage2.sendKeys(contentReceived);
				await browser.wait(async () => await newMessage.getAttribute('value') === contentReceived, 5000);
				const btnSend2 = await chatPage.getSendButton();
				await btnSend2.click();
				await browser.sleep(1000);
				// close tab
				await browser.driver.close();
				// come back to first tab
				await browser.switchTo().window(handles[0]);
			});

			await browser.switchTo().window(handles[0]).then(async () => {
				await browser.sleep(3000);
				const divMessageReceived = await chatPage.getLastReceivedMessageDiv();
				const messageReceivedText = await divMessageReceived.getText();
				expect(messageReceivedText.startsWith(contentReceived)).toBe(true);

				const divMessageReceivedUser = await chatPage.getLastReceivedMessageUserDiv();
				const recUserText = await divMessageReceivedUser.getText();
				expect(recUserText).toBe(user1);
			});
		});
	});

	it('should send and receive message in a persistent room', async () => {
		// create transient room

		const roomName = room4;
		await roomPage.navigateTo(roomName);
		// get persistence toggle
		const persistenceToggle = await createRoomPage.getPersistenceToggle();
		// make room persistent
		persistenceToggle.click();
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		const contentSent = content0;
		const contentReceived = content1;

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(user0);

		const enterButton1 = await usernamePage.getEnterButton();
		await enterButton1.click();

		const chatComponent1 = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent1));
		expect(await chatComponent1.isPresent()).toBe(true);

		// insert text
		const newMessage = await chatPage.getNewMessageInput();
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys(contentSent);
		await browser.wait(async () => await newMessage.getAttribute('value') === contentSent, 5000);
		// send message
		const btnSend = await chatPage.getSendButton();
		await btnSend.click();
		await browser.sleep(1000);

		// get rendered text
		const divMessageSent = await chatPage.getLastSentMessageDiv();
		const messageSentText = await divMessageSent.getText();
		expect(messageSentText.startsWith(contentSent)).toBe(true);

		const divMessageSentUser = await chatPage.getLastSentMessageUserDiv();
		const sentUserText = await divMessageSentUser.getText();
		expect(sentUserText).toBe(user0);

		// start a second client in a new tab
		await browser.executeScript(`window.open('')`);
		await browser.getAllWindowHandles().then(async handles => {
			await browser.switchTo().window(handles[1]).then(async () => {
				await roomPage.navigateTo(roomName);
				// access room
				const usernameInput2 = await usernamePage.getUsernameInput();
				await usernameInput2.click();
				await usernameInput2.clear();
				await usernameInput2.sendKeys(user1);

				const enterButton2 = await usernamePage.getEnterButton();
				await enterButton2.click();

				const chatComponent2 = await chatPage.getChatComponent();
				await browser.wait(EC.visibilityOf(chatComponent2));

				// send a new message from the second client
				const newMessage2 = await chatPage.getNewMessageInput();
				await newMessage2.click();
				await newMessage2.clear();
				await newMessage2.sendKeys(contentReceived);
				await browser.wait(async () => await newMessage.getAttribute('value') === contentReceived, 5000);
				const btnSend2 = await chatPage.getSendButton();
				await btnSend.click();
				await browser.sleep(1000);
				// close tab
				await browser.driver.close();
				// come back to first tab
				await browser.switchTo().window(handles[0]);
			});

			await browser.switchTo().window(handles[0]).then(async () => {
				await browser.sleep(3000);
				const divMessageReceived = await chatPage.getLastReceivedMessageDiv();
				const messageReceivedText = await divMessageReceived.getText();
				expect(messageReceivedText.startsWith(contentReceived)).toBe(true);

				const divMessageReceivedUser = await chatPage.getLastReceivedMessageUserDiv();
				const recUserText = await divMessageReceivedUser.getText();
				expect(recUserText).toBe(user1);
			});
		});
	});

	it('should connect to persistent room and correctly see old messages', async () => {

		const roomName = room4;
		await roomPage.navigateTo(roomName);

		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		const contentSent = content0;
		const contentReceived = content1;

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(user0);

		const enterButton1 = await usernamePage.getEnterButton();
		await enterButton1.click();

		const chatComponent1 = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent1));
		expect(await chatComponent1.isPresent()).toBe(true);

		// do not send
		// old messages should come
		// get rendered text
		const divMessageSent = await chatPage.getLastSentMessageDiv();
		const messageSentText = await divMessageSent.getText();
		expect(messageSentText.startsWith(contentSent)).toBe(true);

		const divMessageSentUser = await chatPage.getLastSentMessageUserDiv();
		const sentUserText = await divMessageSentUser.getText();
		expect(sentUserText).toBe(user0);

		const divMessageReceived = await chatPage.getLastReceivedMessageDiv();
		const messageReceivedText = await divMessageReceived.getText();
		expect(messageReceivedText.startsWith(contentReceived)).toBe(true);

		const divMessageReceivedUser = await chatPage.getLastReceivedMessageUserDiv();
		const recUserText = await divMessageReceivedUser.getText();
		expect(recUserText).toBe(user1);

		// start a second client in a new tab
		await browser.executeScript(`window.open('')`);
		await browser.getAllWindowHandles().then(async handles => {
			await browser.switchTo().window(handles[1]).then(async () => {
				await roomPage.navigateTo(roomName);
				// access room
				const usernameInput2 = await usernamePage.getUsernameInput();
				await usernameInput2.click();
				await usernameInput2.clear();
				await usernameInput2.sendKeys(user1);

				const enterButton2 = await usernamePage.getEnterButton();
				await enterButton2.click();

				const chatComponent2 = await chatPage.getChatComponent();
				await browser.wait(EC.visibilityOf(chatComponent2));

				// received for user0 is sent for user1
				const divMessageSent2 = await chatPage.getLastSentMessageDiv();
				const messageSentText2 = await divMessageSent2.getText();
				expect(messageSentText2.startsWith(contentReceived)).toBe(true);

				const divMessageSentUser2 = await chatPage.getLastSentMessageUserDiv();
				const sentUserText2 = await divMessageSentUser2.getText();
				expect(sentUserText2).toBe(user1);

				const divMessageReceived2 = await chatPage.getLastReceivedMessageDiv();
				const messageReceivedText2 = await divMessageReceived2.getText();
				expect(messageReceivedText2.startsWith(contentSent)).toBe(true);

				const divMessageReceivedUser2 = await chatPage.getLastReceivedMessageUserDiv();
				const recUserText2 = await divMessageReceivedUser2.getText();
				expect(recUserText2).toBe(user0);

				// close tab
				await browser.driver.close();
				// come back to first tab
				await browser.switchTo().window(handles[0]);
			});
		});
	});

	it('should hide a spoiler message content', async () => {

		await roomPage.navigateTo(room5);
		// get persistence toggle
		const persistenceToggle = await createRoomPage.getPersistenceToggle();
		// make room persistent
		persistenceToggle.click();
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		const content = 'content';

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(user2);

		const enterButton1 = await usernamePage.getEnterButton();
		await enterButton1.click();

		const chatComponent1 = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent1));

		// start a second client in a new tab
		await browser.executeScript(`window.open('')`);
		await browser.getAllWindowHandles().then(async handles => {
			await browser.switchTo().window(handles[1]).then(async () => {
				await roomPage.navigateTo(room5);
				// access room
				const usernameInput2 = await usernamePage.getUsernameInput();
				await usernameInput2.click();
				await usernameInput2.clear();
				await usernameInput2.sendKeys(user3);

				const enterButton2 = await usernamePage.getEnterButton();
				await enterButton2.click();

				const chatComponent2 = await chatPage.getChatComponent();
				await browser.wait(EC.visibilityOf(chatComponent2));

				// send a new message from the second client
				const newMessage = await chatPage.getNewMessageInput();
				await newMessage.click();
				await newMessage.clear();
				await newMessage.sendKeys(content);
				// mark message as spoiler
				const btnMarkSpoiler = await chatPage.getBtnMarkSpoiler();
				await btnMarkSpoiler.click();
				await browser.wait(async () => await newMessage.getAttribute('value') === content, 5000);
				const btnSend = await chatPage.getSendButton();
				await btnSend.click();
				await browser.sleep(1000);
				// close tab
				await browser.driver.close();
				// come back to first tab
				await browser.switchTo().window(handles[0]);
			});

			await browser.switchTo().window(handles[0]).then(async () => {
				await browser.sleep(3000);
				const spoilerTitle = await chatPage.getLastReceivedSpoilerTitle();
				expect(await spoilerTitle.getText()).toBe('Spoiler');
			});
		});
	});

	it('spoiler should be still hidden when reconnecting to persistent room', async () => {
		// create transient room

		const roomName = room5;
		await roomPage.navigateTo(roomName);

		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(user2);

		const enterButton1 = await usernamePage.getEnterButton();
		await enterButton1.click();

		const chatComponent1 = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent1));

		const spoilerTitle = await chatPage.getLastReceivedSpoilerTitle();
		expect(await spoilerTitle.getText()).toBe('Spoiler');
	});

	it('should not be able to access twice with same username', async () => {
		// create transient room
		const roomName = getRandomString('e2eroomC', 10);
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(user0);

		const enterButton1 = await usernamePage.getEnterButton();
		await enterButton1.click();

		const chatComponent1 = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent1));
		expect(await chatComponent1.isPresent()).toBe(true);

		// start a second client in a new tab
		await browser.executeScript(`window.open('')`);
		await browser.getAllWindowHandles().then(async handles => {
			await browser.switchTo().window(handles[1]).then(async () => {
				await roomPage.navigateTo(roomName);
				// access room
				const usernameInput2 = await usernamePage.getUsernameInput();
				await usernameInput2.click();
				await usernameInput2.clear();
				await usernameInput2.sendKeys(user0);

				const enterButton2 = await usernamePage.getEnterButton();
				await enterButton2.click();

				// username already taken error should appear
				const errorNotification = await chatPage.getNotification();
				await browser.wait(EC.visibilityOf(errorNotification));
				expect(await errorNotification.isPresent()).toBe(true);

				const userComponent2 = await usernamePage.getUsernameComponent();
				await browser.wait(EC.visibilityOf(userComponent2));
				expect(await userComponent2.isPresent()).toBe(true);

				// close tab
				await browser.driver.close();
				// come back to first tab
				await browser.switchTo().window(handles[0]);
			});
		});
	});

	it('should show dynamic link preview while typing a url', async () => {
		// create transient room
		const roomName = getRandomString('e2eroomLinkPreview', 10);
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(getRandomString('e2eUser', 10));

		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));
		expect(await chatComponent.isPresent()).toBe(true);

		// insert text
		const content = 'content test with www.google.com link';
		const newMessage = await chatPage.getNewMessageInput();
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys(content);
		await browser.wait(async () => await newMessage.getAttribute('value') === content, 5000);
		await browser.sleep(5000);
		// get dynamic preview
		const divLinkPreview = await chatPage.getDynamicLinkPreview();
		expect(divLinkPreview).toBeTruthy();

	});

	it('should show static link preview in a sent message', async () => {
		// create transient room
		const roomName = getRandomString('e2eroomLinkPreview', 10);
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(getRandomString('e2eUser', 10));

		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));
		expect(await chatComponent.isPresent()).toBe(true);

		// insert text
		const content = contentUrl0;
		const newMessage = await chatPage.getNewMessageInput();
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys(content);
		await browser.wait(async () => await newMessage.getAttribute('value') === content, 5000);
		await browser.sleep(5000);
		// send message
		const btnSend = await chatPage.getSendButton();
		await btnSend.click();
		await browser.sleep(1000);

		// get static preview
		const divLinkPreview = await chatPage.getStaticLinkPreviewSent();
		expect(divLinkPreview).toBeTruthy();

	});

	it('should show static link preview in a received message', async () => {
		// create transient room

		const roomName = getRandomString('e2eroomLinkPreview', 10);
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		const contentSent = contentUrl0;
		const contentReceived = contentUrl0;

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(user0);

		const enterButton1 = await usernamePage.getEnterButton();
		await enterButton1.click();

		const chatComponent1 = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent1));
		expect(await chatComponent1.isPresent()).toBe(true);

		// insert text
		const newMessage = await chatPage.getNewMessageInput();
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys(contentSent);
		await browser.wait(async () => await newMessage.getAttribute('value') === contentSent, 5000);
		await browser.sleep(5000);
		// send message
		const btnSend = await chatPage.getSendButton();
		await btnSend.click();
		await browser.sleep(1000);

		// start a second client in a new tab
		await browser.executeScript(`window.open('')`);
		await browser.getAllWindowHandles().then(async handles => {
			await browser.switchTo().window(handles[1]).then(async () => {
				await roomPage.navigateTo(roomName);
				// access room
				const usernameInput2 = await usernamePage.getUsernameInput();
				await usernameInput2.click();
				await usernameInput2.clear();
				await usernameInput2.sendKeys(user1);

				const enterButton2 = await usernamePage.getEnterButton();
				await enterButton2.click();

				const chatComponent2 = await chatPage.getChatComponent();
				await browser.wait(EC.visibilityOf(chatComponent2));

				// send a new message from the second client
				const newMessage2 = await chatPage.getNewMessageInput();
				await newMessage2.click();
				await newMessage2.clear();
				await newMessage2.sendKeys(contentReceived);
				await browser.wait(async () => await newMessage.getAttribute('value') === contentReceived, 5000);
				const btnSend2 = await chatPage.getSendButton();
				await btnSend2.click();
				await browser.sleep(1000);
				// close tab
				await browser.driver.close();
				// come back to first tab
				await browser.switchTo().window(handles[0]);
			});

			await browser.switchTo().window(handles[0]).then(async () => {
				await browser.sleep(3000);
				// get static preview
				const divLinkPreview = await chatPage.getStaticLinkPreviewReceived();
				expect(divLinkPreview).toBeTruthy();
			});
		});
	});

	it('should find a message also with tabs', async () => {
		// create transient room
		const roomName = getRandomString('e2eroomB', 10);
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(getRandomString('e2eUser', 10));

		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));

		// insert text
		const newMessage = await chatPage.getNewMessageInput();
		await browser.wait(EC.visibilityOf(newMessage));
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys('content test');
		await browser.wait(async () => await newMessage.getAttribute('value') === 'content test', 5000);
		// send message
		const btnSend = await chatPage.getSendButton();
		await btnSend.click();
		await browser.sleep(1000);

		// send a link
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys('content www.google.com');
		await browser.wait(async () => await newMessage.getAttribute('value') === 'content www.google.com', 5000);
		await browser.sleep(2000);
		await btnSend.click();
		await browser.sleep(1000);

		// send a spoiler
		const spoilerButton = await chatPage.getBtnMarkSpoiler();
		await spoilerButton.click();
		browser.sleep(200);
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys('spoiler content');
		await browser.wait(async () => await newMessage.getAttribute('value') === 'spoiler content', 5000);
		await btnSend.click();
		await browser.sleep(1000);


		// open search
		const searchButton = await chatPage.getSearchButton();
		await searchButton.click();
		await browser.sleep(1000);

		// if search is open, default message should be visible
		const defaultText = await chatPage.getSearchTextOnOpen();
		expect(defaultText).toBeTruthy();


		// type to search messages
		const searchInput = await chatPage.getSearchInputText();
		await browser.wait(EC.visibilityOf(searchInput));
		await searchInput.click();
		await searchInput.clear();
		await searchInput.sendKeys('c');
		await browser.wait(async () => await searchInput.getAttribute('value') === 'c', 5000);
		browser.sleep(1000);

		// get found message
		let foundMessage;
		foundMessage = await chatPage.getFoundMessage();
		await browser.wait(EC.visibilityOf(foundMessage));
		expect(await foundMessage.isPresent()).toBe(true);

		// search with filters
		// links
		await browser.executeScript('arguments[0].click();', await chatPage.getsearchLinksRadio());
		await browser.sleep(2000);
		await searchInput.click();
		await searchInput.clear();
		await searchInput.sendKeys('google');
		await browser.wait(async () => await searchInput.getAttribute('value') === 'google', 5000);
		foundMessage = await chatPage.getFoundMessage();
		await browser.wait(EC.visibilityOf(foundMessage));
		expect(await foundMessage.isPresent()).toBe(true);

		// spoilers
		await browser.executeScript('arguments[0].click();', await chatPage.getsearchSpoilersRadio());
		await browser.sleep(2000);
		await searchInput.click();
		await searchInput.clear();
		await searchInput.sendKeys('spoiler');
		await browser.wait(async () => await searchInput.getAttribute('value') === 'spoiler', 5000);
		foundMessage = await chatPage.getFoundMessage();
		await browser.wait(EC.visibilityOf(foundMessage));
		expect(await foundMessage.isPresent()).toBe(true);
	});

	it('should show active users list and find user', async () => {
		// create transient room
		const roomName = getRandomString('e2eroomActiveUsers', 10);
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		await usernameComponent.isPresent();

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(user0);

		const enterButton1 = await usernamePage.getEnterButton();
		await enterButton1.click();

		const chatComponent1 = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent1));
		await chatComponent1.isPresent();

		// start a second client in a new tab
		await browser.executeScript(`window.open('')`);
		await browser.getAllWindowHandles().then(async handles => {
			await browser.switchTo().window(handles[1]).then(async () => {
				await roomPage.navigateTo(roomName);
				// access room
				const usernameInput2 = await usernamePage.getUsernameInput();
				await usernameInput2.click();
				await usernameInput2.clear();
				await usernameInput2.sendKeys(user1);

				const enterButton2 = await usernamePage.getEnterButton();
				await enterButton2.click();

				const chatComponent2 = await chatPage.getChatComponent();
				await browser.wait(EC.visibilityOf(chatComponent2));
				await chatComponent2.isPresent();

				const btnActiveUsers2 = await chatPage.getButtonActiveUsers();
				await btnActiveUsers2.click();

				const activeUsersDialog2 = await chatPage.getActiveUsersDialog();
				await browser.wait(EC.visibilityOf(activeUsersDialog2));
				expect(await activeUsersDialog2.isPresent()).toBe(true);

				const activeUsersSearch2 = await chatPage.getActiveUsersDialogSearch();
				await activeUsersSearch2.isPresent();
				await activeUsersSearch2.click();
				await activeUsersSearch2.clear();
				await activeUsersSearch2.sendKeys(user0);

				const usersList = await chatPage.getUsersInList();
				await browser.sleep(1500);
				expect(usersList.length).toBe(1);
				expect(await usersList[0].getText()).toBe(user0);

				// close tab
				await browser.driver.close();
				// come back to first tab
				await browser.switchTo().window(handles[0]);
			});
		});
	});
	/**
	 * Chat
	 */

	it('should pin, navigate and remove sticky message', async () => {
		// create transient room
		const roomName = getRandomString('e2eroomB', 10);
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(getRandomString('e2eUser', 10));

		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));
		expect(await chatComponent.isPresent()).toBe(true);

		// insert text
		const content = 'test1';
		const newMessage = await chatPage.getNewMessageInput();
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys(content);
		await browser.wait(async () => await newMessage.getAttribute('value') === content, 5000);
		// send message
		const btnSend = await chatPage.getSendButton();
		await btnSend.click();
		await browser.sleep(1000);

		// get rendered text
		const divMessageSent = await chatPage.getLastSentMessageDiv();
		const messageSentText = await divMessageSent.getText();
		expect(messageSentText.startsWith(content)).toBe(true);
		await browser.sleep(1000);

		// insert text
		const content2 = 'test2';
		const newMessage2 = await chatPage.getNewMessageInput();
		await newMessage2.click();
		await newMessage2.clear();
		await newMessage2.sendKeys(content2);
		await browser.wait(async () => await newMessage2.getAttribute('value') === content2, 5000);
		// send message
		const btnSend2 = await chatPage.getSendButton();
		await btnSend2.click();
		await browser.sleep(1000);

		// get rendered text
		const divMessageSent2 = await chatPage.getLastSentMessageDiv();
		const messageSentText2 = await divMessageSent2.getText();
		expect(messageSentText2.startsWith(content2)).toBe(true);
		await browser.sleep(1000);


		// pin message
		const btnMenu = await chatPage.getMenu();
		await btnMenu[0].click();

		const btnPin = await chatPage.getOption();
		await btnPin.click();
		await browser.sleep(1000);

		await btnMenu[1].click();

		await btnPin.click();
		await browser.sleep(1000);

		// navigate between sticky messages
		const btnNextSticky = await chatPage.getNextSticky();
		await btnNextSticky.click();
		await browser.sleep(1000);
		await btnNextSticky.click();
		await browser.sleep(1000);

		// remove sticky
		await btnMenu[1].click();
		await btnPin.click();
		await browser.sleep(1000);

		await btnMenu[0].click();
		await btnPin.click();
		await browser.sleep(1000);
	});

	it('should show notification when user join/leave a room', async () => {
		// create transient room
		const roomName = getRandomString('e2eroomA', 10);
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		expect(await usernameComponent.isPresent()).toBe(true);

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(user0);

		const enterButton1 = await usernamePage.getEnterButton();
		await enterButton1.click();

		const chatComponent1 = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent1));
		expect(await chatComponent1.isPresent()).toBe(true);

		// start a second client in a new tab
		await browser.executeScript(`window.open('')`);
		await browser.getAllWindowHandles().then(async handles => {
			await browser.switchTo().window(handles[1]).then(async () => {
				await roomPage.navigateTo(roomName);
				// access room
				const usernameInput2 = await usernamePage.getUsernameInput();
				await usernameInput2.click();
				await usernameInput2.clear();
				await usernameInput2.sendKeys(user1);

				const enterButton2 = await usernamePage.getEnterButton();
				await enterButton2.click();

				const chatComponent2 = await chatPage.getChatComponent();
				await browser.wait(EC.visibilityOf(chatComponent2));

				// come back to first tab
				await browser.switchTo().window(handles[0]);
				const joinNotification = await chatPage.getNotification();
				await browser.wait(EC.visibilityOf(joinNotification));
				expect(await joinNotification.isPresent()).toBe(true);

				// come back to second tab
				await browser.switchTo().window(handles[1]);
				// close tab
				await browser.driver.close();

				// come back to first tab
				await browser.switchTo().window(handles[0]);
				const leaveNotification = await chatPage.getNotification();
				await browser.wait(EC.visibilityOf(leaveNotification));
				expect(await leaveNotification.isPresent()).toBe(true);
			});
		});
	});

	it('should show the topic of a spoiler message', async () => {
		// create transient room
		const roomName = room0;
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(getRandomString('e2eUser', 10));

		const enterButton = await usernamePage.getEnterButton();
		await enterButton.click();

		// if room is accessed the chat should be visible
		const chatComponent = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent));

		// insert text
		const newMessage = await chatPage.getNewMessageInput();
		await browser.wait(EC.visibilityOf(newMessage));
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys('content test');
		await browser.wait(async () => await newMessage.getAttribute('value') === 'content test', 5000);
		// send a spoiler message with topic
		const spoilerButton = await chatPage.getBtnMarkSpoiler();
		await spoilerButton.click();
		browser.sleep(200);
		const spoilerTopicButton = await chatPage.getBtnSpoilerTopic();
		await spoilerTopicButton.click();
		browser.sleep(200);
		const spoilerTopicInput = await chatPage.getSpoilerTopicInput();
		await spoilerTopicInput.click();
		await spoilerTopicInput.clear();
		await spoilerTopicInput.sendKeys('spoiler topic');
		await newMessage.click();
		await newMessage.clear();
		await newMessage.sendKeys('spoiler content');
		await browser.wait(async () => await newMessage.getAttribute('value') === 'spoiler content', 5000);
		const btnSend = await chatPage.getSendButton();
		await btnSend.click();
		await browser.sleep(1000);

		// check spoiler topic
		const spoilerTopic = await chatPage.getSpoilerTopic();
		expect(spoilerTopic.getText()).toBe('spoiler topic');
		await browser.sleep(1000);

	});

	it('should kick a user', async () => {
		// create transient room
		const roomName = getRandomString('e2eroomKick', 10);
		await roomPage.navigateTo(roomName);
		// get create button
		const createButton = await createRoomPage.getCreateButton();
		// create room by clicking
		await createButton.click();
		// if room is created the username component is shown
		const usernameComponent = await usernamePage.getUsernameComponent();
		await usernameComponent.isPresent();

		// access room
		const usernameInput = await usernamePage.getUsernameInput();
		await usernameInput.click();
		await usernameInput.clear();
		await usernameInput.sendKeys(user0);

		const enterButton1 = await usernamePage.getEnterButton();
		await enterButton1.click();

		const chatComponent1 = await chatPage.getChatComponent();
		await browser.wait(EC.visibilityOf(chatComponent1));
		await chatComponent1.isPresent();

		// start a second client in a new tab
		await browser.executeScript(`window.open('')`);
		await browser.getAllWindowHandles().then(async handles => {
			await browser.switchTo().window(handles[1]).then(async () => {
				await roomPage.navigateTo(roomName);
				// access room
				const usernameInput2 = await usernamePage.getUsernameInput();
				await usernameInput2.click();
				await usernameInput2.clear();
				await usernameInput2.sendKeys(user1);

				const enterButton2 = await usernamePage.getEnterButton();
				await enterButton2.click();

				const chatComponent2 = await chatPage.getChatComponent();
				await browser.wait(EC.visibilityOf(chatComponent2));
				await chatComponent2.isPresent();

				const btnActiveUsers2 = await chatPage.getButtonActiveUsers();
				await btnActiveUsers2.click();

				const btnKick = await chatPage.getBtnKick();
				await btnKick.click();

				// close tab
				await browser.driver.close();

				// come back to first tab
				await browser.switchTo().window(handles[0]).then(async () => {
					await browser.waitForAngularEnabled(false);
					// check if the user got kicked
					await browser.getCurrentUrl().then(async (url) => {
						expect(url).toBe('http://localhost:4200/');
					});
					await browser.waitForAngularEnabled(true);
				});
			});
			await browser.sleep(1000);
		});
	});

});
