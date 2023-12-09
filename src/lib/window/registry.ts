import type { SvelteComponent } from "svelte";

let registry: { [key: string]: [SvelteComponent, { [key: string]: any }?] } = {};

import Dialog from "$lib/window/Dialog.svelte";
