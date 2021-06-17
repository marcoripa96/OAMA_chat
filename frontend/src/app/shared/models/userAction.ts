/**
 * User action
 */
export interface BaseUserAction {
	username: string;
	action: string;
}

/**
 * User action kick
 */
export interface UserActionKick extends BaseUserAction {
	kickedUsername: string;
}
