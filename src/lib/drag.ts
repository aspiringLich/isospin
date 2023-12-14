import { clamp } from "$lib/utils";

export type DragOptions = {
	/** The bounds */
	bounds: HTMLElement | "parent";

	/** A selector to get the drag handle */
	handle_selector: string;
};

export const drag = (node: HTMLElement, options: DragOptions) => {
	const body_style = document.body.style;

	let bounding_element: HTMLElement;

	let bounding_rect: DOMRect;
	let bounding_observer = new ResizeObserver(() => {
		bounding_rect = bounding_element.getBoundingClientRect();
		set_measurements();
		readjust();
	});

	// these are here to make the garbage collector happy
	let cxmin: number;
	let cymin: number;
	let cxmax: number;
	let cymax: number;
	let cx: number;
	let cy: number;
	const set_measurements = () => {
		cxmin = node.offsetWidth / 2;
		cymin = node.offsetHeight / 2;
		cxmax = bounding_rect.width - cxmin;
		cymax = bounding_rect.height - cymin;
	};
	let node_observer = new ResizeObserver(() => {
		node.clientWidth;
		set_measurements();
	});
	node_observer.observe(node);

	let handle: HTMLElement;

	let original_user_select_val: string;

	let initial = true;
	let offset_x = 0;
	let offset_y = 0;
	let final_cx: number = 0;
	let final_cy: number = 0;

	let percent_x: number = 0;
	let percent_y: number = 0;

	const setTranslate = (cx0: number, cy0: number) => {
		cx = cx0 - bounding_rect.left;
		cy = cy0 - bounding_rect.top;

		percent_x = (cx - cxmin) / (cxmax - cxmin);
		percent_y = (cy - cymin) / (cymax - cymin);

		final_cx = clamp(cx, cxmin, cxmax);
		final_cy = clamp(cy, cymin, cymax);

		node.style.transform = `translate3d(${final_cx - cxmin}px, ${final_cy - cymin}px, 0)`;
	};

	const readjust = () => {
		cx = cxmin + percent_x * (cxmax - cxmin) - bounding_rect.left;
		cy = cymin + percent_y * (cymax - cymin) - bounding_rect.top;

		final_cx = clamp(cx, cxmin, cxmax);
		final_cy = clamp(cy, cymin, cymax);

		node.style.transform = `translate3d(${final_cx - cxmin}px, ${final_cy - cymin}px, 0)`;
	};

	const onmousedown = (e: MouseEvent) => {
		if (e.button !== 0 && e.button !== 1) return;

		let { clientX, clientY } = e;
		offset_x = clientX - final_cx;
		offset_y = clientY - final_cy;

		e.preventDefault();

		node.classList.add("dragging");

		original_user_select_val = body_style.userSelect;
		body_style.userSelect = "none";

		document.addEventListener("pointermove", onmousemove, false);
		document.addEventListener("pointerup", onmouseup, false);
	};

	const onmousemove = (e: MouseEvent) => {
		e.preventDefault();
		setTranslate(e.clientX - offset_x, e.clientY - offset_y);
	};

	const onmouseup = (e: MouseEvent) => {
		body_style.userSelect = original_user_select_val;

		node.classList.remove("dragging");

		document.removeEventListener("pointermove", onmousemove, false);
		document.removeEventListener("pointerup", onmouseup, false);
	};

	const update = (options: DragOptions) => {
		const { handle_selector } = options;

		// get the bounding element
		if (options.bounds === "parent") bounding_element = node.parentElement as HTMLElement;
		else bounding_element = options.bounds;

		// update bounding_rect
		bounding_observer.disconnect();
		bounding_rect = bounding_element.getBoundingClientRect();
		bounding_observer.observe(bounding_element);

		set_measurements();

		// update handle
		handle?.removeEventListener("pointerdown", onmousedown, false);
		handle = node.querySelector(handle_selector) as HTMLElement;
		handle.addEventListener("pointerdown", onmousedown, false);

		// center the node
		if (initial) setTranslate(bounding_rect.width / 2, bounding_rect.height / 2);
		initial = false;
	};
	update(options);

	return {
		update,
		destroy() {
			body_style.userSelect = original_user_select_val;
			handle.removeEventListener("pointerdown", onmousedown, false);
			document.removeEventListener("pointermove", onmousemove, false);
			document.removeEventListener("pointerup", onmouseup, false);
		},
	};
};
