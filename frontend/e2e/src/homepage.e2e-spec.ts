import { browser, protractor, ProtractorExpectedConditions } from 'protractor';
import { AppPage } from './pages/app.po';
import { Homepage } from './pages/homepage.po';

/**
 * Testing the homepage has some problems with Angular and rxjs,
 * timer and intervals cause protractor to timeout and the option waitForAngularEnabled(false)
 * causes subsequential errors.
 */

describe('Homepage', () => {
	let page: Homepage;
	let appPage: AppPage;
	let EC: ProtractorExpectedConditions;

	beforeEach(() => {
		page = new Homepage();
		appPage = new AppPage();
		EC = protractor.ExpectedConditions;
	});

	/* 	it('should navigate to lobby with toolbar button', async () => {
		browser.waitForAngularEnabled(false);
		// navigate to the route of the page we are testing
		await page.navigateTo();

		const elem = await page.getBtnBrowseLobby();
		await browser.wait(EC.visibilityOf(elem));

		elem.click();
	});

	it('should navigate to login with toolbar button', async () => {
		browser.waitForAngularEnabled(false);
		await page.navigateTo();
		browser.waitForAngularEnabled(true);
		await browser.sleep(1000);
		const elem = await page.getBtnLogin();
		await browser.wait(EC.elementToBeClickable(elem));
		elem.click();
		browser.waitForAngularEnabled(false);
		// check if login component shows
	});

	it('should navigate to signup with toolbar button', async () => {
		browser.waitForAngularEnabled(false);

		await page.navigateTo();

		await browser.sleep(1000);

		const elem = await page.getBtnSignup();
		await browser.wait(EC.visibilityOf(elem));

		elem.click();

		// check if signup component shows
	}); */


	it('should toggle between themes', async () => {
		browser.waitForAngularEnabled(false);

		await page.navigateTo();

		await browser.sleep(1000);

		const themeButton = await page.getBtnTheme();
		themeButton.click();
		await browser.sleep(3000);

		const buttonDark = await page.getDarkRadioButton();
		await buttonDark.click();
		await browser.sleep(100);

		const darkThemeComponent = await appPage.getDarkThemeComponent();
		await browser.wait(EC.presenceOf(darkThemeComponent));

		expect(await darkThemeComponent.isPresent()).toBe(true);

		const buttonDefault = await page.getDefaultRadioButton();
		await buttonDefault.click();
		await browser.sleep(100);

		expect(await darkThemeComponent.isPresent()).toBe(false);

		const buttonAdaptive = await page.getAdaptiveRadioButton();
		await buttonAdaptive.click();
		await browser.sleep(100);

		const currentTime = new Date().getHours();
		const isDark = currentTime >= 18 || currentTime <= 5 ? true : false;

		await browser.waitForAngularEnabled(false);
		expect(await darkThemeComponent.isPresent()).toBe(isDark);
		await buttonDefault.click();
		await browser.sleep(100);
		await browser.waitForAngularEnabled(true);
	});


});
