import { Injectable } from '@angular/core';

// Default audio path
const AUDIO_PATH = '/assets/audio/';

/**
 * Service which queues sounds.
 */
@Injectable({
	providedIn: 'root'
})
export class AudioService {

	constructor() { }

	/**
	 * Plays the given action sound
	 */
	playSound(action: string): void {
		const audio = new Audio(`${AUDIO_PATH}${action}.mp3`);
		audio.play();
	}
}
