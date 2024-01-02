<script lang="ts" context="module">
	import { writable, type Writable } from "svelte/store";

	export let focused_window: Writable<number | null> = writable(null);
</script>

<script lang="ts">
	import { drag } from "$lib/drag";
	import Cross from "$src/icon/Cross.svelte";
	import { desktop } from "$cpt/desktop/Desktop.svelte";
	import { fly } from "svelte/transition";
	import { createEventDispatcher, onMount } from "svelte";
	import { PROCESSES } from "$src/components/window";
	import Icon from "$src/icon/Icon.svelte";
	import { AppIcon } from "$src/icon";

	export let id: string;
	export let title: string;
	export let width: [number, number] = [160, 120];
	export let content: boolean = false;

	let icon = AppIcon[id as keyof typeof AppIcon] || 0;

	let pid = PROCESSES.add_process(id);
	focused_window.set(pid);
	let close_hovered = false;
	let element: HTMLElement;

	let open = false;
	onMount(() => {
		open = true;
		dispatch("open");
	});

	const dispatch = createEventDispatcher();

	const close = () => {
		open = false;
		PROCESSES.remove_process(pid);
		if (pid === $focused_window) $focused_window = null;
	};
	const focus = (e: MouseEvent) => {
		e.stopImmediatePropagation();
		$focused_window = pid;

		let self = element.parentElement;
		if (desktop.lastChild === self || !self) return;
		desktop.appendChild(self);
		dispatch("focus");
	};
</script>

{#if open}
	<div class="absolute w-0 h-0" transition:fly={{ duration: 400, y: 40 }}>
		<div
			use:drag={{ bounds: desktop, handle_selector: ".titlebar" }}
			on:pointerdown={focus}
			bind:this={element}
			class="window bg-slate-100 border-2 border-slate-400 shadow-xl
			flex flex-col group"
			class:!border-rose-500={close_hovered}
			class:focus={$focused_window === pid}
			style:--width="{width[0] / 4}rem"
			style:--width-small="{width[1] / 4}rem"
		>
			<div
				class="titlebar cursor-grab group-[&.dragging]:cursor-grabbing select-none
				bg-slate-400 grid grid-cols-[1fr] text-[90%] font-semibold"
			>
				<Icon class="titlebar-icon" {icon} size={21.6} />
				<span class="titlebar-title text-center">{title}</span>
				<button
					class="titlebar-button-close transition-colors duration-200
					bg-slate-400
					hover:bg-rose-400 hover:text-rose-800
					active:bg-rose-400 active:text-rose-900
					justify-self-end self-center mr-[0.2rem] rounded-full"
					on:pointerenter={() => (close_hovered = true)}
					on:pointerleave={() => (close_hovered = false)}
					on:pointerdown={(e) => e.stopImmediatePropagation()}
					on:pointerup={close}
				>
					<Cross />
				</button>
			</div>

			<div class="window-content" class:content class:prose={content}>
				<slot />
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.window-content.content {
		@apply p-2;
	}

	.window {
		font-family: VeraMono, monospace;
		@apply duration-200 transition-[background-color,border-color,box-shadow];
		@apply w-[var(--width-small)] md:w-[var(--width)];
	}

	.window.focus {
		@apply shadow-2xl;
	}

	.window:not(.focus) {
		@apply select-none;
	}

	.window :global(.titlebar-icon),
	.titlebar-button-close,
	.titlebar-title {
		grid-row: 1;
		grid-column: 1;
	}
</style>
