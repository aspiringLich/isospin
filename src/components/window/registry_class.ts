import type { ComponentType } from "svelte";
import { desktop } from "../../routes/FloppaOS.svelte";

export type Item = { component: ComponentType; props: { [key: string]: any } };

export class Registry {
	items: Map<string, Item> = new Map();

	register(id: string, component: any, props: { [key: string]: any }) {
		this.items.set(id, { component, props });
	}

	spawn(id: string) {
		let item = this.items.get(id);
		// TODO: spawn an error window instead of just returning
		if (!item) return;

		new item.component({ target: desktop, props: item.props });
	}
}
