<script lang="ts" context="module">
	import { writable, type Writable } from "svelte/store";

	export let focused_window: Writable<number | null> = writable(null);
</script>

<script lang="ts">
	import { drag } from "$lib/drag";
	import Cross from "$icn/Cross.svelte";
	import { desktop } from "$src/routes/FloppaOS.svelte";
	import { fly } from "svelte/transition";
	import { onMount } from "svelte";
	import { PROCESSES } from "$src/components/window/window";

	export let id: string;
	export let title: string;
	export let width: [number, number] = [160, 120];

	let pid = PROCESSES.add_process(id);
	let close_hovered = false;
	let element: HTMLElement;

	let open = false;
	onMount(() => {
		open = true;
		PROCESSES.remove_process(pid);
	});

	const close = () => {
		open = false;
		if (pid === $focused_window) $focused_window = null;
	};
	const focus = (e: MouseEvent) => {
		e.stopPropagation();
		$focused_window = pid;
	};
</script>

{#if open}
	<div transition:fly={{ y: 20, duration: 400 }}>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			use:drag={{ bounds: desktop, handle_selector: ".titlebar" }}
			on:click={focus}
			bind:this={element}
			class="window bg-slate-100 border-2 border-slate-500
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
					justify-self-end self-center mr-[0.2rem]"
					on:mouseenter={() => (close_hovered = true)}
					on:mouseleave={() => (close_hovered = false)}
					on:click={close}
				>
					<Cross />
				</button>
			</div>
			<div class="overflow-auto">
				<slot />
			</div>
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

	.titlebar-button-close,
	.titlebar-icon,
	.titlebar-title {
		grid-row: 1;
		grid-column: 1;
	}
</style>
