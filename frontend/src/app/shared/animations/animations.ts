import { trigger, transition, style, animate, keyframes, animation, group, query, stagger, animateChild, state } from '@angular/animations';

/**
 * Enter animation by changing the height of the element
 */
export const enterAnimation = trigger('enterAnimation', [
	transition(':enter', [
		style({ height: 0, paddingTop: 0, paddingBottom: 0, opacity: 0 }),
		animate('300ms ease-out', style({ height: '*', paddingTop: '*', paddingBottom: '*', opacity: 1 }))
	]),
	transition(':leave', [
		style({ height: '*', paddingTop: '*', paddingBottom: '*', opacity: 1 }),
		animate('300ms ease-out', style({ height: '0', paddingTop: 0, paddingBottom: 0, opacity: 0 }))
	])
]);

/**
 * Enter animation by scaling element
 */
export const enterScaleAnimation = trigger('enterAnimation', [
	transition(':enter', [
		style({ transform: 'scale(1.2)', opacity: 0 }),
		animate('250ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
	])
]);

/**
 * Shake animation right to left and left to right
 */
export const shakeAnimation = trigger('shakeAnimation', [
	transition('* => true', [
		style({ transform: 'translateX(0)' }),
		animate('300ms ease-out', keyframes([
			style({ transform: 'translateX(0)' }),
			style({ transform: 'translateX(2%)' }),
			style({ transform: 'translateX(0)' }),
			style({ transform: 'translate(-2%)' }),
			style({ transform: 'translateY(0)' }),
			style({ transform: 'translateX(2%)' }),
			style({ transform: 'translateX(0)' }),
			style({ transform: 'translate(-2%)' }),
			style({ transform: 'translateY(0)' }),
		]))
	])
]);

/**
 * Slide bottom to top with gradually increasing opacity
 */
export const slideAnimation = animation(
	[
		style({
			height: '{{ fromHeight }}',
			opacity: '{{ fromOpacity }}',
			paddingTop: '{{ fromPadding }}',
			paddingBottom: '{{ fromPadding }}'
		}),
		group([
			animate(
				'{{ timings }}',
				style({
					height: '{{ toHeight }}',
					opacity: '{{ toOpacity }}'
				})
			),
			animate(
				'100ms ease-in-out',
				style({
					paddingTop: '{{ toPadding }}',
					paddingBottom: '{{ toPadding }}'
				})
			)
		])
	],
	{
		params: {
			timings: '250ms ease-out',
			fromOpacity: 1,
			toOpacity: 1,
			fromPadding: 0,
			toPadding: 0
		}
	}
);

/**
 * Animate a list with stagger delay
 */
export const listAnimation = trigger('listAnimation', [
	transition('* => true', [
		query('@*', stagger(300, animateChild()))
	]),
]);

/**
 * Animate a list with lower stagger delay
 */
export const listAnimationFast = trigger('listAnimationFast', [
	transition('* => true', [
		query('@*', stagger(150, animateChild()))
	]),
]);

/**
 * Enter animation from below with translate
 */
export const translateY = trigger('translateY', [
	state('false', style({
		opacity: 0
	})),
	transition('* => true', [
		style({ transform: 'translateY({{startY}})', opacity: 0 }),  // initial
		animate('{{timing}} cubic-bezier(0.07, 0.89, 0.79, 0.95)',
			style({ transform: 'translateY(0px)', opacity: 1 }))  // final
	], {
		params: {
			startY: '50px',
			timing: '0.7s'
		}
	})
]);

/**
 * Fade in animation
 */
export const fadeIn = trigger('fadeIn', [
	transition(':enter', [
		style({ opacity: 0 }),
		animate('250ms ease-out', style({ opacity: 1 }))
	])
]);

/**
 * Fade in animation
 */
export const fadeOut = trigger('fadeOut', [
	transition(':leave', [
		style({ opacity: 1 }),
		animate('250ms ease-out', style({ opacity: 0 }))
	])
]);


/**
 * Enter right to left animation
 */
export const rightToLeft = trigger('rightToLeft', [
	transition(':enter', [
		style({ transform: 'translateX(20%)', opacity: 0 }),
		animate('250ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
	])
]);






