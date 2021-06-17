export interface LinkPreview {
	url?: string;
	title?: string;
	description?: string;
	image?: string;
}


/**
 * Response given from the API for each LinkPreview request.
 */
export interface LinkPreviewResponse {
	message?: string;
	data?: LinkPreview;
}
