import { clamp } from "$lib/utils";
import type { Action, RequestEvent } from "@sveltejs/kit";

export type DragOptions = {
	/** The bounding element */
	bounding_element: HTMLElement | "parent";

	/** A selector to get the drag handle */
	handle_selector: string;
};

export const drag = (node: HTMLElement, options: DragOptions) => {
	console.log("drag");
	const body_style = document.body.style;

	let bounding_element: HTMLElement;

	let bounding_rect: DOMRect;
	let bounding_observer = new ResizeObserver(() => {
		console.log("bounding resize");
		setTranslate(final_x, final_y, false);
		bounding_rect = bounding_element.getBoundingClientRect();
	});

	let node_rect: DOMRect = node.getBoundingClientRect();
	let node_observer = new ResizeObserver(() => {
		console.log("node resize");
		node_rect = node.getBoundingClientRect();
	});
	node_observer.observe(node);

	let handle: HTMLElement;

	let initial = true;
	let original_user_select_val: string;
	let offset_x = 0;
	let offset_y = 0;
	let final_x: number = 0;
	let final_y: number = 0;

	const setTranslate = (x: number, y: number, save: boolean = true) => {
		// get x and y clamped to the bounding element
		x = x - bounding_rect.left;
		y = y - bounding_rect.top;

		x = clamp(x, 0, bounding_rect.width - node_rect.width);
		y = clamp(y, 0, bounding_rect.height - node_rect.height);

		if (save) {
			final_x = x;
			final_y = y;
		}

		node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
	};

	const onmousedown = (e: MouseEvent) => {
		if (e.button !== 0 && e.button !== 1) return;

		let { clientX, clientY } = e;
		offset_x = clientX - final_x;
		offset_y = clientY - final_y;

		console.log("mousedown");
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
		console.log("mouseup");
		body_style.userSelect = original_user_select_val;

		document.removeEventListener("pointermove", onmousemove, false);
		document.removeEventListener("pointerup", onmouseup, false);
	};

	const update = (options: DragOptions) => {
		console.log("update");
		const { handle_selector } = options;

		// get the bounding element
		if (options.bounding_element === "parent")
			bounding_element = node.parentElement as HTMLElement;
		else bounding_element = options.bounding_element;

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
				bounding_rect.width / 2 - node_rect.width / 2,
				bounding_rect.height / 2 - node_rect.height / 2
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
