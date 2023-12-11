/**
 * Creates a debounced function that delays invoking func until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked.
 *
 * @param func the function to debounce
 * @param wait the delay in millis
 * @returns The debounced function
 */
export function debounce<T extends Function>(func: T, wait = 20) {
	let timer: any;
	let callable = (...args: any) => {
		clearTimeout(timer);
		timer = setTimeout(() => func(...args), wait);
	};
	return <T>(<any>callable);
}

/**
 * Creates a throttled function that only invokes func at most once per every
 * `wait` milliseconds.
 *
 * @param func the function to throttle
 * @param wait the delay in millis
 * @returns The throttled function
 */
export function throttle<T extends Function>(func: T, wait = 20) {
	let timer: any;
	let callable = (...args: any) => {
		if (!timer) {
			timer = setTimeout(() => {
				func(...args);
				timer = null;
			}, wait);
		}
	};
	return <T>(<any>callable);
}

/** Returns a promise that will resolve in `ms` ms */
export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Converts rem to px  */
export function rem_to_px(rem: number) {
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

/** Clamps `val` between `min` and `max` */
export function clamp(val: number, min: number, max: number) {
	return Math.min(Math.max(val, min), max);
}

/** Returns the number greatest in magnitude */
export function largest(a: number, b: number) {
	return Math.abs(a) > Math.abs(b) ? a : b;
}

/** Returns the number smallest in magnitude */
export function smallest(a: number, b: number) {
	return Math.abs(a) < Math.abs(b) ? a : b;
}

/** Preloads a list of image urls */
export function preload_images(...urls: string[]) {
	for (const url of urls) {
		const img = new Image();
		img.src = url;
	}
}
