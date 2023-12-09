import type { SvelteComponent } from "svelte";
import Dialog__SvelteComponent_ from "$lib/window/Dialog.svelte";

export type WindowData = {
	component: SvelteComponent;
	props: { [key: string]: any };
};

class Registry {
	static map: Map<string, WindowData> = new Map();
}

function register(id: string, component: SvelteComponent, props: { [key: string]: any } = {}) {
	Registry.map.set(id, { component, props });
}
