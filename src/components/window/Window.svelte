<script lang="ts">
	import { drag } from "$lib/drag";
	import Cross from "$icn/Cross.svelte";
	import { desktop } from "$src/routes/FloppaOS.svelte";
	import { fly } from "svelte/transition";
	import { onMount } from "svelte";

	export let title: string;
	/** [normal, small] */
	export let width: [number, number] = [160, 120];
	/** [normal, small] */
	export let height: [number, number] = [120, 90];

	let clientWidth: number;
	let clientHeight: number;

	let close_hovered = false;

	let open = false;
	onMount(() => {
		open = true;
	});
</script>

{#if open}
	<div transition:fly={{ y: 20, duration: 400 }}>
		<div
			use:drag={{ bounds: desktop, handle_selector: ".titlebar" }}
			class="window bg-slate-100 border-2 border-slate-400 transition-colors duration-200
			w-[var(--width-small)] md:w-[var(--width)] h-[var(--height-small)] md:h-[var(--height)]
			flex flex-col group"
			class:!border-rose-500={close_hovered}
			style:--width="{width[0] / 4}rem"
			style:--width-small="{width[1] / 4}rem"
			style:--height="{height[0] / 4}rem"
			style:--height-small="{height[1] / 4}rem"
			bind:clientWidth
			bind:clientHeight
		>
			<div
				class="titlebar cursor-grab group-[&.dragging]:cursor-grabbing select-none
			bg-slate-300 grid grid-cols-[1fr] text-[90%] font-semibold"
			>
				<span class="titlebar-icon">icon</span>
				<span class="titlebar-title text-center">{title}</span>
				<button
					class="titlebar-button-close transition-colors duration-200
				bg-slate-300 hover:bg-rose-300 hover:text-rose-700
				justify-self-end self-center mr-0.5"
					on:mouseenter={() => (close_hovered = true)}
					on:mouseleave={() => (close_hovered = false)}
					on:click={() => (open = false)}
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
	}

	.titlebar-button-close,
	.titlebar-icon,
	.titlebar-title {
		grid-row: 1;
		grid-column: 1;
	}
</style>
