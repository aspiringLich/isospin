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

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function rem_to_px(rem: number) {
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
