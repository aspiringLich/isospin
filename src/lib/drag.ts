import { clamp } from "$lib/utils";
import type { Action, RequestEvent } from "@sveltejs/kit";

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
		readjust();
	});

	let node_rect: DOMRect = node.getBoundingClientRect();
	let node_observer = new ResizeObserver(() => {
		node_rect = node.getBoundingClientRect();
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
		const xmin = node_rect.width / 2;
		const ymin = node_rect.height / 2;
		const cxmax = bounding_rect.width - xmin;
		const cymax = bounding_rect.height - ymin;

		const cx = cx0 - bounding_rect.left;
		const cy = cy0 - bounding_rect.top;

		percent_x = (cx - xmin) / (cxmax - xmin);
		percent_y = (cy - ymin) / (cymax - ymin);

		final_cx = clamp(cx, xmin, cxmax);
		final_cy = clamp(cy, ymin, cymax);

		node.style.transform = `translate3d(${final_cx - xmin}px, ${final_cy - ymin}px, 0)`;
	};

	const readjust = () => {
		const xmin = node_rect.width / 2;
		const ymin = node_rect.height / 2;
		const cxmax = bounding_rect.width - xmin;
		const cymax = bounding_rect.height - ymin;

		const cx = xmin + percent_x * (cxmax - xmin) - bounding_rect.left;
		const cy = ymin + percent_y * (cymax - ymin) - bounding_rect.top;

		final_cx = clamp(cx, xmin, cxmax);
		final_cy = clamp(cy, ymin, cymax);

		node.style.transform = `translate3d(${final_cx - xmin}px, ${final_cy - ymin}px, 0)`;
	};

	const onmousedown = (e: MouseEvent) => {
		if (e.button !== 0 && e.button !== 1) return;

		let { clientX, clientY } = e;
		offset_x = clientX - final_cx;
		offset_y = clientY - final_cy;

		e.preventDefault();

		original_user_select_val = body_style.userSelect;
		body_style.userSelect = "none";

		document.addEventListener("pointermove", onmousemove, false);
		document.addEventListener("pointerup", onmouseup, false);
	};

	const onmousemove = (e: MouseEvent) => {
		const { clientX, clientY } = e;

		setTranslate(clientX - offset_x, clientY - offset_y);
	};

	const onmouseup = (e: MouseEvent) => {
		body_style.userSelect = original_user_select_val;

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
