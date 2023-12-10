import { clamp } from "$lib/utils";
import type { Action, RequestEvent } from "@sveltejs/kit";

export type DragOptions = {
	/** The bounds */
	bounds: HTMLElement | "parent";

	/** A selector to get the drag handle */
	handle_selector: string;
};

export const drag = (node: HTMLElement, options: DragOptions) => {
	// console.log("drag");
	const body_style = document.body.style;

	let bounding_element: HTMLElement;

	let bounding_rect: DOMRect;
	let bounding_observer = new ResizeObserver(() => {
		// console.log("bounding resize");
		bounding_rect = bounding_element.getBoundingClientRect();
		setTranslate(final_x, final_y, true);
	});

	let node_rect: DOMRect = node.getBoundingClientRect();
	let node_observer = new ResizeObserver(() => {
		// console.log("node resize");
		node_rect = node.getBoundingClientRect();
	});
	node_observer.observe(node);

	let handle: HTMLElement;

	let original_user_select_val: string;

	let initial = true;
	let offset_x = 0;
	let offset_y = 0;
	let final_x: number = 0;
	let final_y: number = 0;
	let acc_dx = 0;
	let acc_dy = 0;
	let p_width = node_rect.width;
	let p_height = node_rect.height;

	const setTranslate = (x: number, y: number, readjust: boolean = false) => {
		// get x and y clamped to the bounding element
		const x1 = x - bounding_rect.left;
		const y1 = y - bounding_rect.top;

		const xmax = bounding_rect.width - node_rect.width;
		const ymax = bounding_rect.height - node_rect.height;

		x = clamp(x1, 0, xmax);
		y = clamp(y1, 0, ymax);

		if (readjust) {
			// adjust the position to account for the change in size
			let dwidth = bounding_rect.width - p_width;
			let dheight = bounding_rect.height - p_height;
			x += dwidth * (x / xmax);
			y += dheight * (y / ymax);
			p_width = bounding_rect.width;
			p_height = bounding_rect.height;

			// accumulate the difference between the clamped and unclamped values
			const ax = x - x1;
			const ay = y - y1;
			acc_dx += ax;
			acc_dy += ay;

			// adjust the final position by the accumulated difference
			if (acc_dx < 0 && ax == 0) {
				let dx = x - xmax;
				x -= Math.max(dx, acc_dx);
				acc_dx -= Math.max(dx, acc_dx);
			}
			if (acc_dy < 0 && ay == 0) {
				let dy = y - ymax;
				y -= Math.max(dy, acc_dy);
				acc_dy -= Math.max(dy, acc_dy);
			}
		}

		final_x = x;
		final_y = y;

		node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
	};

	const onmousedown = (e: MouseEvent) => {
		if (e.button !== 0 && e.button !== 1) return;

		let { clientX, clientY } = e;
		offset_x = clientX - final_x;
		offset_y = clientY - final_y;

		acc_dx = 0;
		acc_dy = 0;

		// console.log("mousedown");
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
		// console.log("mouseup");
		body_style.userSelect = original_user_select_val;

		document.removeEventListener("pointermove", onmousemove, false);
		document.removeEventListener("pointerup", onmouseup, false);
	};

	const update = (options: DragOptions) => {
		// console.log("update");
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
		if (initial)
			setTranslate(
				bounding_rect.width / 4 - node_rect.width / 4,
				bounding_rect.height / 4 - node_rect.height / 4
			);
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
