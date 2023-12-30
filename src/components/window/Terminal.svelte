<script lang="ts" context="module">
	function is_control_code(s: string) {
		return s.charCodeAt(0) < 0x20;
	}

	const command_set: Set<string> = new Set(["help", "clear", "cd", "ls"]);
</script>

<script lang="ts">
	import Terminal, { ansi } from "$src/components/Terminal.svelte";
	import Window from "$src/components/window/Window.svelte";
	import type { Terminal as xtermTerminal } from "xterm";

	export let title: string;
	export let id: string;

	let process: Promise<void> | null = null;
	let command = "";

	let term: xtermTerminal;

	const update_prompt = () => {
		let prompt = ansi.reset + "$ ";
		let first = true;
		let autocomplete = null;

		for (let i = 0; i < command.length; ) {
			// get run of non whitespace and whitespace characters
			let j;
			for (j = i; j < command.length && !/\s/.test(command[j]); j++);
			let chunk = command.slice(i, j);
			i = j;

			for (; j < command.length && /\s/.test(command[j]); j++);
			let whitespace = command.slice(i, j);
			i = j;

			let new_chunk = "";

			for (const char of chunk) {
				if (is_control_code(char)) {
					new_chunk += "^" + String.fromCharCode(char.charCodeAt(0) + 0x40);
				} else {
					new_chunk += char;
				}
			}

			if (new_chunk.length == 0) continue;

			if (first) {
				for (const cmd of command_set) {
					if (cmd.startsWith(chunk)) {
						autocomplete = cmd;
						break;
					}
				}

				if (autocomplete) {
					let slice = autocomplete.slice(chunk.length);
					prompt += ansi.fg.bright_green + new_chunk + ansi.fg.dark_blue + slice;
					if (slice.length) prompt += ansi.left(slice.length);
				} else {
					prompt += ansi.fg.bright_red + new_chunk;
				}
				prompt += ansi.fg.bright_cyan + whitespace;
			} else {
				prompt += new_chunk + whitespace;
			}

			first = false;
		}

		term.write(ansi.reset + ansi.erase_line + "\r" + prompt);
	};

	const init = (e: CustomEvent<{ term: xtermTerminal }>) => {
		term = e.detail.term;
		term.options.cursorBlink = true;

		term.writeln("");
		term.writeln("Welcome to flop, the interactive shell built for Floppa OS");
		term.writeln("Type \x1b[92mhelp\x1b[0m for a list of commands");
		term.writeln("");

		update_prompt();

		term.onData((e) => {
			switch (e) {
				case "\r": // enter
					term.writeln("");
					// run_command();
					command = "";
					update_prompt();
					break;
				case "\u0003": // ctrl+C
					command += "\u0003";
					update_prompt();
					break;
				case "\u007F": // backspace
					if (command.length > 0) {
						command = command.slice(0, -1);
						update_prompt();
					}
					break;
				default:
					if (e <= String.fromCharCode(0x7e) || e >= "\u00a0") {
						command += e;
					}
					update_prompt();
			}
		});
	};
</script>

<Window {title} {id}>
	<Terminal on:ready={init} />
</Window>
