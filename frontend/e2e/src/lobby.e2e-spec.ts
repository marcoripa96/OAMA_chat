import { browser, protractor, ProtractorExpectedConditions } from 'protractor';
import { LobbyPage } from './pages/lobby.po';
import { UsernamePage } from './pages/username.po';


describe('Lobby page', () => {
	let lobbyPage: LobbyPage;
	let usernamePage: UsernamePage;
	let EC: ProtractorExpectedConditions;

	beforeEach(async () => {
		lobbyPage = new LobbyPage();
		usernamePage = new UsernamePage();

		EC = protractor.ExpectedConditions;
	});

	it('should show rooms', async () => {
		await lobbyPage.navigateTo();
		await browser.sleep(1000);
		const rooms = await lobbyPage.getRooms();

		expect(rooms).toBeTruthy();
	});

	it('should enter the first room', async () => {
		await lobbyPage.navigateTo();
		await browser.sleep(1000);
		const rooms = await lobbyPage.getRooms();

		await rooms[0].click();
		await browser.sleep(1000);

		const pageTitle = await usernamePage.getPageTitle();

		await browser.wait(EC.visibilityOf(pageTitle));

		expect(await pageTitle).toBeTruthy();
	});

	it('should load more rooms', async () => {
		await lobbyPage.navigateTo();
		await browser.sleep(1000);

		const roomsInitial = await lobbyPage.getRooms();
		expect(roomsInitial.length).toBe(21);

		await browser.executeScript('window.scrollTo(0,10000);');
		await browser.sleep(1000);

		const loadMoreBtn = await lobbyPage.btnLoadMore();
		await browser.wait(EC.visibilityOf(loadMoreBtn));

		loadMoreBtn.click();
		await browser.sleep(2000);

		const roomsAfter = await lobbyPage.getRooms();
		expect(roomsAfter.length).toBe(42);
	});

	it('should scroll to top', async () => {
		await lobbyPage.navigateTo();
		await browser.sleep(1000);

		await browser.executeScript('window.scrollTo(0,10000);');
		await browser.sleep(1000);

		const scrollBtn = await lobbyPage.btnScrollTop();
		await browser.wait(EC.visibilityOf(scrollBtn));
		expect(scrollBtn).toBeTruthy();
		scrollBtn.click();
		await browser.sleep(1000);
	});

});
