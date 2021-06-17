/* eslint-disable max-len */
/**
 * Strict URL regex. (ex.: youtube.com isn't matched)
 */
export const STRICT_URL_REGEX = /(?<=\s|^)((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g;

/**
 * Looser URL regex which matches all types of urls.
 */
export const LOOSE_URL_REGEX = /(?<=\s|^)(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@%!\$&'\(\)\*\+,;=.]+/g;
