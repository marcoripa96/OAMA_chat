import { LinkPreview } from './linkPreview';

/**
 * Base message
 */
export interface BaseMessage {
	room: string;
	username: string;
}
/**
 * Message sent in chat
 */
export interface ChatMessage extends BaseMessage{
	_id?: string;
	content: string;
	spoiler?: boolean;
	spoilerTopic?: string;
	firstLinkPreview?: LinkPreview;
	sentDate?: Date;
}


export interface ChatMessageResponse {
	message?: string;
	data?: ChatMessage[];
}
