<script lang="ts">
	import { onMount, createEventDispatcher, type EventDispatcher } from "svelte";
	import type { Terminal } from "xterm";
	import type { FitAddon } from "xterm-addon-fit";
	import { debounce } from "$lib/util";

	let term: Terminal;
	let fit_addon: FitAddon;
	let term_div: HTMLDivElement;
	let dispatch: EventDispatcher<Record<"ready", { term: Terminal }>> = createEventDispatcher();

	onMount(async () => {
		const { Terminal } = await import("xterm");
		fit_addon = new (await import("xterm-addon-fit")).FitAddon();
		const webgl_addon = new (await import("xterm-addon-webgl")).WebglAddon();

		term = new Terminal({
			fontFamily: "VeraMono, monospace",
			fontWeight: "500",
		});

		term.loadAddon(fit_addon);
		term.open(term_div);
		fit_addon.fit();

		webgl_addon.onContextLoss((e) => {
			webgl_addon.dispose();
		});
		term.loadAddon(webgl_addon);

		dispatch("ready", { term });
	});

	let resize = debounce(() => {
		if (term) fit_addon?.fit();
	}, 20);
</script>

<svelte:window on:resize={resize} />

<div id="terminal" class="h-full w-full bg-black" bind:this={term_div} />
