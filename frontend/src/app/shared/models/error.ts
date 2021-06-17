/**
 * The error processed by the HttpErrorInterceptor.
 */
export interface InterceptorError {
	errorMessage: string;
	resMessage?: string;
	error?: any;
}

export interface AckMessage {
	event: string;
	success: boolean;
	errcode?: string;
	message?: string;
	data?: any;
}
