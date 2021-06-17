import { TestBed, async, inject } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('Service: LocalStorage', () => {
	let service: LocalStorageService;
	let store;
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [LocalStorageService]
		});

		store= {};
		/**
		 * Mock of LocalStorage
		 */
		const mockLocalStorage = {
			getItem: (key: string): string => key in store ? store[key] : null,
			setItem: (key: string, value: string) => {
				store[key] = `${value}`;
			},
			removeItem: (key: string) => {
				delete store[key];
			},
			clear: () => {
				store = {};
			}
		};
		service = TestBed.inject(LocalStorageService);
		spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
		spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
		spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
		spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
	});
	it('it should create the service', () => {
		expect(service).toBeTruthy();
	});
	it('it should store the token in localStorage', () => {
		service.set('username', 'Zanfrano');
		expect(JSON.parse(localStorage.getItem('username'))).toEqual('Zanfrano');
	});
	it('it should return stored token from localStorage', () => {
		localStorage.setItem('username', JSON.stringify('Zanfrano'));
		expect(service.get('username')).toEqual('Zanfrano');
	});
	it('it should remove stored token from localStorage', () => {
		localStorage.setItem('username', JSON.stringify('Zanfrano'));
		expect(service.remove('username')).toBeTruthy();
	});
});
