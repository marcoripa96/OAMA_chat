import { browser, protractor, ProtractorExpectedConditions } from 'protractor';
import { SignupPage } from './pages/signup.po';


describe('Signup page', () => {
	let signupPage: SignupPage;
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

	const randomEmail = 'example' + getRandomString('', 4) + '@example.com';

	beforeEach(async () => {
		signupPage = new SignupPage();

		EC = protractor.ExpectedConditions;
	});

	/**
	 * Register user
	 */
	it('should show password hint if form is invalid', async () => {
		await signupPage.navigateTo();

		const emailInput = await signupPage.getEmailInput();
		const nameInput = await signupPage.getNameInput();
		const passwordInput = await signupPage.getPasswordInput();
		const passwordConfirmInput = await signupPage.getPasswordConfirmInput();

		await emailInput.click();
		await emailInput.clear();
		await emailInput.sendKeys('example@e2e.com');

		await nameInput.click();
		await nameInput.clear();
		await nameInput.sendKeys('Mario Rossi');

		const _password = 'inval';

		await passwordInput.click();
		await passwordInput.clear();
		await passwordInput.sendKeys(_password);

		await passwordConfirmInput.click();
		await passwordConfirmInput.clear();
		await passwordConfirmInput.sendKeys(_password);

		const passwordHint = await signupPage.getPasswordHint();

		expect(await passwordHint.isPresent()).toBeTruthy();
		await browser.sleep(5000);
	});

	/**
	 * Register user
	 */
	it('should not show password hint if form is valid', async () => {
		await signupPage.navigateTo();

		const emailInput = await signupPage.getEmailInput();
		const nameInput = await signupPage.getNameInput();
		const passwordInput = await signupPage.getPasswordInput();
		const passwordConfirmInput = await signupPage.getPasswordConfirmInput();

		await emailInput.click();
		await emailInput.clear();
		await emailInput.sendKeys('exampleValid@e2e.com');

		await nameInput.click();
		await nameInput.clear();
		await nameInput.sendKeys('Mario Rossi');

		const _password = 'Val1dPassw!rd';

		await passwordInput.click();
		await passwordInput.clear();
		await passwordInput.sendKeys(_password);

		await passwordConfirmInput.click();
		await passwordConfirmInput.clear();
		await passwordConfirmInput.sendKeys(_password);

		const passwordHint = await signupPage.getPasswordHint();

		expect(await passwordHint.isPresent()).toBeFalsy();
		await browser.sleep(5000);
	});

	/**
	 * Register user
	 */
	it('should successfully register a new valid user', async () => {
		await signupPage.navigateTo();

		const emailInput = await signupPage.getEmailInput();
		const nameInput = await signupPage.getNameInput();
		const passwordInput = await signupPage.getPasswordInput();
		const passwordConfirmInput = await signupPage.getPasswordConfirmInput();

		await emailInput.click();
		await emailInput.clear();
		await emailInput.sendKeys(randomEmail);

		await nameInput.click();
		await nameInput.clear();
		await nameInput.sendKeys('Mario Rossi');

		const _password = 'Th1sIs?a?Secret';

		await passwordInput.click();
		await passwordInput.clear();
		await passwordInput.sendKeys(_password);

		await passwordConfirmInput.click();
		await passwordConfirmInput.clear();
		await passwordConfirmInput.sendKeys(_password);

		// submit
		await browser.sleep(1000);

		const signupBtn = await signupPage.getSignupButton();
		await signupBtn.click();
		// if (await signupBtn.isPresent()) {
		// 	await signupBtn.click();
		// }
		await browser.sleep(3000);

		// should create user successfully and redirect to login
		const notification = await signupPage.getNotification();
		expect(await notification.isPresent()).toBe(true);

		expect((await browser.getCurrentUrl()).includes('/signup')).toBeFalsy();
		expect((await browser.getCurrentUrl()).includes('/login')).toBeTruthy();

		await browser.sleep(1000);
	});

	/**
	 * Register user
	 */
	it('should fail when trying to register an already registered email and show notification', async () => {
		await signupPage.navigateTo();

		const emailInput = await signupPage.getEmailInput();
		const nameInput = await signupPage.getNameInput();
		const passwordInput = await signupPage.getPasswordInput();
		const passwordConfirmInput = await signupPage.getPasswordConfirmInput();

		await emailInput.click();
		await emailInput.clear();
		await emailInput.sendKeys(randomEmail);

		await nameInput.click();
		await nameInput.clear();
		await nameInput.sendKeys('Mario Rossi');

		const _password = 'Th1sIs?a?Secret';

		await passwordInput.click();
		await passwordInput.clear();
		await passwordInput.sendKeys(_password);

		await passwordConfirmInput.click();
		await passwordConfirmInput.clear();
		await passwordConfirmInput.sendKeys(_password);

		// submit
		await browser.sleep(1000);

		const signupBtn = await signupPage.getSignupButton();
		await signupBtn.click();
		if (await signupBtn.isPresent()) {
			await signupBtn.click();
		}
		await browser.sleep(3000);

		const notification = await signupPage.getNotification();
		expect(await notification.isPresent()).toBe(true);

		expect((await browser.getCurrentUrl()).includes('/signup')).toBeTruthy();

		await browser.sleep(1000);
	});
});
