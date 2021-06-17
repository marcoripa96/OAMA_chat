import { Pagination } from './pagination';
import { ChatMessage } from './message';

export interface Room {
	_id?: string;
	name: string;
	description?: string;
	password?: string;
	private: boolean;
	stickyMessages: ChatMessage[];
}

/**
 * Response given from the API for each Room request.
 */
export interface RoomResponse {
	message?: string;
	data?: Room[];
	more?: boolean;
}

/**
 * Request to a find query
 */
export interface RoomRequest {
	pagination: Pagination;
	private?: boolean;
	persistent?: boolean;
	query?: string;
}
