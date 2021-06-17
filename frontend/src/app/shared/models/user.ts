export interface User {
	_id?: string;
	email: string;
	name: string;
	password?: string;
	requirePasswordChange?: boolean;
	emailIsVerified?: boolean;
	emailToken?: string;
	date?: Date;
}

/**
 * Response given from the API for each Room request.
 */
export interface UserResponse {
	message?: string;
	data?: User[];
	status?: number;
}
