import type { ComponentType } from "svelte";
import { desktop } from "$cpt/desktop/Desktop.svelte";

export type Item = { component: ComponentType; props: { [key: string]: any } };
export type App = {
	id: string;
	name: string;
	icon: string;
};

export class Registry {
	items: Map<string, Item> = new Map();
	applications: Map<number, App[]> = new Map();

	register_window(id: string, component: any, props: { [key: string]: any }) {
		this.items.set(id, { component, props });
	}

	register_app(id: string, name: string, icon: string, row: number) {
		if (!this.applications.has(row)) {
			this.applications.set(row, []);
		}
		this.applications.get(row)?.push({ id, name, icon });
	}

	spawn(id: string) {
		let item = this.items.get(id);
		// TODO: spawn an error window instead of just returning
		if (!item) return;

		new item.component({
			target: desktop,
			props: {
				id,
				...item.props,
			},
		});
	}
}

export class Processes {
	active: Map<number, string> = new Map();
	pid: number = -1;

	next_pid(): number {
		this.pid = (this.pid + 1) % 4096;
		return this.pid;
	}

	add_process(id: string): number {
		// TODO: handle running out of pids
		while (this.active.has(this.next_pid())) {}
		this.active.set(this.pid, id);
		return this.pid;
	}

	remove_process(pid: number) {
		this.active.delete(pid);
	}
}

export const PROCESSES: Processes = new Processes();
