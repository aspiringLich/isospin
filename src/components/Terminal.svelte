<script lang="ts" context="module">
	export const theme = {
		foreground: "#F8F8F8",
		background: "#1E1E1D",
		selection: "#5DA5D533",
		black: "#1E1E1D",
		brightBlack: "#262625",
		red: "#CE5C5C",
		brightRed: "#FF7272",
		green: "#5BCC5B",
		brightGreen: "#72FF72",
		yellow: "#CCCC5B",
		brightYellow: "#FFFF72",
		blue: "#5D5DD3",
		brightBlue: "#7279FF",
		magenta: "#BC5ED1",
		brightMagenta: "#E572FF",
		cyan: "#5DA5D5",
		brightCyan: "#72F0FF",
		white: "#F8F8F8",
		brightWhite: "#FFFFFF",
	};

	export const ansi = {
		reset: "\x1b[0m",
		erase_line: "\x1b[2K",
		up: (n: number) => `\x1b[${n}A`,
		down: (n: number) => `\x1b[${n}B`,
		right: (n: number) => `\x1b[${n}C`,
		left: (n: number) => `\x1b[${n}D`,
		fg: {
			dark_red: "\x1b[31m",
			dark_green: "\x1b[32m",
			dark_yellow: "\x1b[33m",
			dark_blue: "\x1b[34m",
			dark_magenta: "\x1b[35m",
			dark_cyan: "\x1b[36m",
			dark_white: "\x1b[37m",
			bright_black: "\x1b[90m",
			bright_red: "\x1b[91m",
			bright_green: "\x1b[92m",
			bright_yellow: "\x1b[93m",
			bright_blue: "\x1b[94m",
			bright_magenta: "\x1b[95m",
			bright_cyan: "\x1b[96m",
			bright_white: "\x1b[97m",
		},
	};
</script>

<script lang="ts">
	import { onMount, createEventDispatcher, type EventDispatcher } from "svelte";
	import type { Terminal } from "xterm";
	import type { FitAddon } from "xterm-addon-fit";
	import { throttle } from "$lib/utils";

	export { classes as class };
	let classes: string = "";

	let term: Terminal;
	let fit_addon: FitAddon;
	let term_div: HTMLDivElement;
	let dispatch: EventDispatcher<Record<"ready", { term: Terminal }>> = createEventDispatcher();

	onMount(async () => {
		const { Terminal } = await import("xterm");
		fit_addon = new (await import("xterm-addon-fit")).FitAddon();
		const webgl_addon = new (await import("xterm-addon-webgl")).WebglAddon();

		term = new Terminal({
			theme,
			fontFamily: "VeraMono, monospace",
			fontWeight: "500",
			allowProposedApi: true,
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

	let resize = throttle(() => {
		if (term) fit_addon?.fit();
	}, 20);
</script>

<svelte:window on:resize={resize} />

<div
	id="terminal"
	class="h-full w-full px-2 {classes}"
	style:background-color={theme.background}
	bind:this={term_div}
/>
