<script lang="ts">
	import { focused_window } from "$src/components/window/Window.svelte";

	let grid_element: HTMLElement;
	let selection_element: HTMLElement;
	let bounds: DOMRect;
	let select = false;
	let x = 0;
	let y = 0;
	let dx = 0;
	let dy = 0;

	const dragstart = (e: MouseEvent) => {
		focused_window.set(null);

		bounds = grid_element.getBoundingClientRect();
		x = e.clientX - bounds.left;
		y = e.clientY - bounds.top;
		select = true;
	};

	const drag = (e: MouseEvent) => {
		if (!select) return;

		bounds = grid_element.getBoundingClientRect();
		dx = e.clientX - bounds.left - x;
		dy = e.clientY - bounds.top - y;

		if (!selection_element) return;

		selection_element.style.width = `${Math.abs(dx)}px`;
		selection_element.style.height = `${Math.abs(dy)}px`;
		selection_element.style.transform = `translate3d(${x + (dx < 0 ? dx : 0)}px, ${
			y + (dy < 0 ? dy : 0)
		}px, 0)`;
	};

	const dragend = () => {
		select = false;
	};
</script>

<div
	class="grid-bg fixed w-full h-full"
	on:pointerdown={dragstart}
	on:pointermove={drag}
	on:pointerup={dragend}
	on:pointerleave={dragend}
	bind:this={grid_element}
>
	{#if select}
		<div
			class="select fixed bg-sky-500/20 border border-sky-600"
			bind:this={selection_element}
		/>
	{/if}
	<slot />
</div>

<style lang="postcss">
	.grid-bg::before {
		@apply w-full h-full fixed bg-cover bg-center bg-[var(--color-bg)];
	}

	.grid-bg {
		background: linear-gradient(
				0deg,
				transparent 9%,
				var(--color-grid-2) 10%,
				var(--color-grid-2) 12%,
				transparent 13%,
				transparent 29%,
				var(--color-grid-1) 30%,
				var(--color-grid-1) 31%,
				transparent 32%,
				transparent 49%,
				var(--color-grid-1) 50%,
				var(--color-grid-1) 51%,
				transparent 52%,
				transparent 69%,
				var(--color-grid-1) 70%,
				var(--color-grid-1) 71%,
				transparent 72%,
				transparent 89%,
				var(--color-grid-1) 90%,
				var(--color-grid-1) 91%,
				transparent 92%,
				transparent
			),
			linear-gradient(
				90deg,
				transparent 9%,
				var(--color-grid-2) 10%,
				var(--color-grid-2) 12%,
				transparent 13%,
				transparent 29%,
				var(--color-grid-1) 30%,
				var(--color-grid-1) 31%,
				transparent 32%,
				transparent 49%,
				var(--color-grid-1) 50%,
				var(--color-grid-1) 51%,
				transparent 52%,
				transparent 69%,
				var(--color-grid-1) 70%,
				var(--color-grid-1) 71%,
				transparent 72%,
				transparent 89%,
				var(--color-grid-1) 90%,
				var(--color-grid-1) 91%,
				transparent 92%,
				transparent
			),
			var(--color-bg);
		background-size: 50px 50px;
	}
</style>
