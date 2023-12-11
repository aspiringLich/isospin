<script lang="ts">
	import Terminal from "$cpt/Terminal.svelte";
	import type { Terminal as xtermTerminal } from "xterm";
	import { LINES } from "./lines";
	import { sleep } from "$lib/utils";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	async function start(e: CustomEvent<{ term: xtermTerminal }>) {
		let term: xtermTerminal = e.detail.term;

		let enable_sleep = true;
		for (const line of LINES) {
			if (line[2] == ":") {
				let content = line.slice(4);
				switch (line.slice(0, 2)) {
					case "  ":
						term.writeln(content);
						break;
					case "OK":
						term.writeln("[\x1b[32m  OK  \x1b[0m] " + content);
						break;
					case "__":
						term.writeln("         " + content);
						break;
				}
				if (enable_sleep) await sleep(5);
			} else {
				let split = line.split(" ");
				let fn = split[0];
				let args = split.slice(1);
				switch (fn) {
					case "nosleep":
						enable_sleep = false;
						break;
					case "sleep":
						if (args.length) await sleep(parseInt(args[0]));
						else enable_sleep = true;
						break;
					case "clear":
						term.clear();
						break;
				}
			}
		}

		dispatch("ready");
	}
</script>

<Terminal on:ready={start} />
