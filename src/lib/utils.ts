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

/**
 * The cyrb53 hash function.
 * @param str the string to hash
 * @param seed  starting seed
 * @returns 53-bit hash of the string
 */
export function cyrb53(str: string, seed = 0) {
	let h1 = 0xdeadbeef ^ seed,
		h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
