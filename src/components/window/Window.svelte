<script lang="ts" context="module">
	import { writable, type Writable } from "svelte/store";

	export let focused_window: Writable<number | null> = writable(null);
</script>

<script lang="ts">
	import { drag } from "$lib/drag";
	import Cross from "$icn/Cross.svelte";
	import { desktop } from "$src/routes/FloppaOS.svelte";
	import { scale } from "svelte/transition";
	import { onMount } from "svelte";
	import { PROCESSES } from "$src/components/window";

	export let id: string;
	export let title: string;
	export let width: [number, number] = [160, 120];

	let pid = PROCESSES.add_process(id);
	focused_window.set(pid);
	let close_hovered = false;
	let element: HTMLElement;

	let open = false;
	onMount(() => {
		open = true;
	});

	const close = () => {
		open = false;
		PROCESSES.remove_process(pid);
		if (pid === $focused_window) $focused_window = null;
	};
	const focus = (e: MouseEvent) => {
		e.stopImmediatePropagation();
		$focused_window = pid;
	};
</script>

{#if open}
	<div transition:scale={{ duration: 400, start: 0.4 }}>
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
				<span class="titlebar-icon">icon</span>
				<span class="titlebar-title text-center">{title}</span>
				<button
					class="titlebar-button-close transition-colors duration-200
					bg-slate-400 hover:bg-rose-400 hover:text-rose-800
					justify-self-end self-center mr-[0.2rem] rounded-full"
					on:mouseenter={() => (close_hovered = true)}
					on:mouseleave={() => (close_hovered = false)}
					on:click={close}
				>
					<Cross />
				</button>
			</div>

			<slot />
		</div>
	</div>
{/if}

<style lang="postcss">
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

	.titlebar-button-close,
	.titlebar-icon,
	.titlebar-title {
		grid-row: 1;
		grid-column: 1;
	}
</style>
