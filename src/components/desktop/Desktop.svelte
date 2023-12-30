<script lang="ts" context="module">
	import { writable } from "svelte/store";

	export let desktop: HTMLElement;
	export let size = writable({ width: 0, height: 0 });
</script>

<script lang="ts">
	import { focused_window } from "$src/components/window/Window.svelte";

	let selection_element: HTMLElement;
	let bounds: DOMRect;
	let select = false;
	let x = 0;
	let y = 0;
	let dx = 0;
	let dy = 0;

	const dragstart = (e: MouseEvent) => {
		focused_window.set(null);

		bounds = desktop.getBoundingClientRect();
		x = e.clientX - bounds.left;
		y = e.clientY - bounds.top;
		select = true;
	};

	const drag = (e: MouseEvent) => {
		if (!select) return;

		bounds = desktop.getBoundingClientRect();
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

	import { registry } from "$src/components/window/registry";
	import Icon from "$icn/Icon.svelte";
	import { AppIcon } from "$icn";

	let applications = registry.applications;
	let rows = [...applications.keys()].sort();

	const make_stupid_error_shut_up = (icon: string): number => {
		return AppIcon[icon as keyof typeof AppIcon];
	};
</script>

<div
	class="grid-bg fixed w-full h-full"
	on:pointerdown={dragstart}
	on:pointermove={drag}
	on:pointerup={dragend}
	on:pointerleave={dragend}
	bind:this={desktop}
	bind:clientWidth={$size.width}
	bind:clientHeight={$size.height}
>
	<div class="desktop-icons fixed w-full h-full">
		{#each rows as row}
			{@const apps = applications.get(row) || []}
			{#each apps as app}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="icon flex items-center justify-center m-1"
					style:--row={row < 0 ? row - 1 : row}
					on:pointerdown={(e) => e.stopImmediatePropagation()}
					on:dblclick={() => registry.spawn(app.id)}
				>
					<div class="relative w-min">
						<Icon
							class="inline-block m-auto"
							icon={make_stupid_error_shut_up(app.icon)}
							size={64}
						/>
						<span class="icon-text absolute bottom-[-10px] right-0 w-full">
							{app.name}
						</span>
					</div>
				</div>
			{/each}
		{/each}
	</div>
	{#if select}
		<div
			class="select fixed bg-sky-500/20 border border-sky-600"
			bind:this={selection_element}
		/>
	{/if}
	<slot />
</div>

<style lang="postcss">
	.icon-text {
		font-family: VeraMono, monospace;
		@apply text-xs font-semibold text-center;
		line-height: 0.75rem;
	}

	.icon {
		@apply select-none cursor-pointer;
		place-self: stretch;
		grid-row: var(--row);
	}

	.icon:hover {
		@apply bg-sky-500/20;
	}

	.desktop-icons {
		@apply grid p-6;
		grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
		grid-template-rows: repeat(auto-fill, minmax(5rem, 1fr));
	}

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
