/* tslint:disable:no-unused-variable */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async, inject } from '@angular/core/testing';
import { TOKENAPI } from '@shared/tokens/token-api';
import { environment } from 'environments/environment';
import { LinkPreviewService } from './link-preview.service';

describe('Service: LinkPreview', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [LinkPreviewService,
				{ provide: TOKENAPI, useValue: environment.backendUrl }]
		});
	});

	it('should be created', inject([LinkPreviewService], (service: LinkPreviewService) => {
		expect(service).toBeTruthy();
	}));
});
