import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { UserService } from './user.service';

describe('UserService', () => {
	let service: UserService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				UserService,
				{ provide: TOKENAPI, useValue: environment.backendUrl }
			]
		});
		TestBed.configureTestingModule({});

		service = TestBed.inject(UserService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
