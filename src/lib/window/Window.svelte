<script lang="ts">
	import { onMount } from "svelte";
	import { draggable, type DragOptions } from "@neodrag/svelte";
	import { size } from "../../routes/FloppaOS.svelte";
	import { rem_to_px } from "$lib/util";

	export let title: string;
	/** [normal, small] */
	export let width: [number, number] = [160, 120];
	/** [normal, small] */
	export let height: [number, number] = [120, 90];

	let window_opts: DragOptions;
	let clientWidth: number;
	let clientHeight: number;

	let loaded = false;
	let position = { x: 0, y: 0 };

	onMount(() => {
		let md = $size.width > 768 ? 0 : 1;
		position = {
			x: Math.round($size.width / 2 - rem_to_px(width[md] / 8)),
			y: Math.round($size.height / 2 - rem_to_px(height[md] / 8)),
		};
		window_opts = {
			handle: ".titlebar",
			bounds: "parent",
			position,
		};
		loaded = true;
	});
</script>

{#if loaded}
	<div
		use:draggable={window_opts}
		class="window bg-slate-100 border-2 border-slate-400
		w-[var(--width-small)] md:w-[var(--width)]
		h-[var(--height-small)] md:h-[var(--height)]
		flex flex-col"
		style:--width="{width[0] / 4}rem"
		style:--width-small="{width[1] / 4}rem"
		style:--height="{height[0] / 4}rem"
		style:--height-small="{height[1] / 4}rem"
		bind:clientWidth
		bind:clientHeight
	>
		<div
			class="titlebar cursor-grab active:cursor-grabbing select-none
		bg-slate-300 grid grid-cols-[0px_1fr_0px] text-[90%] font-semibold"
		>
			<span class="titlebar-icon">icon</span>
			<span class="titlebar-title text-center">{title}</span>
			<div class="titlebar-buttons">
				<svg
					class="titlebar-close cursor-pointer w-4 h-4 m-1"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						class="fill-rose-300 opacity-0 transition-opacity duration-200"
						cx="7.5"
						cy="7.5"
						r="7.5"
						fill="currentColor"
						fill-rule="evenodd"
						clip-rule="evenodd"
					/>
					<path
						class="stroke-rose-400"
						d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
						fill-rule="evenodd"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
		</div>
		<div class="overflow-auto">
			<slot />
		</div>
	</div>
{/if}

<style lang="postcss">
	.window {
		font-family: VeraMono, monospace;
	}

	.titlebar-buttons {
		direction: rtl;
	}

	.titlebar-close:hover circle {
		@apply opacity-50;
	}
</style>
