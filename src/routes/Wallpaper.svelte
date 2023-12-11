<script lang="ts">
	import { focused_window } from "$src/components/window/Window.svelte";

	const defocus = () => {
		focused_window.set(null);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="grid-bg fixed w-full h-full" on:click={defocus}>
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
				rgb(var(--color-grid-2)) 10%,
				rgb(var(--color-grid-2)) 12%,
				transparent 13%,
				transparent 29%,
				rgb(var(--color-grid-1)) 30%,
				rgb(var(--color-grid-1)) 31%,
				transparent 32%,
				transparent 49%,
				rgb(var(--color-grid-1)) 50%,
				rgb(var(--color-grid-1)) 51%,
				transparent 52%,
				transparent 69%,
				rgb(var(--color-grid-1)) 70%,
				rgb(var(--color-grid-1)) 71%,
				transparent 72%,
				transparent 89%,
				rgb(var(--color-grid-1)) 90%,
				rgb(var(--color-grid-1)) 91%,
				transparent 92%,
				transparent
			),
			linear-gradient(
				90deg,
				transparent 9%,
				rgb(var(--color-grid-2)) 10%,
				rgb(var(--color-grid-2)) 12%,
				transparent 13%,
				transparent 29%,
				rgb(var(--color-grid-1)) 30%,
				rgb(var(--color-grid-1)) 31%,
				transparent 32%,
				transparent 49%,
				rgb(var(--color-grid-1)) 50%,
				rgb(var(--color-grid-1)) 51%,
				transparent 52%,
				transparent 69%,
				rgb(var(--color-grid-1)) 70%,
				rgb(var(--color-grid-1)) 71%,
				transparent 72%,
				transparent 89%,
				rgb(var(--color-grid-1)) 90%,
				rgb(var(--color-grid-1)) 91%,
				transparent 92%,
				transparent
			),
			var(--color-bg);
		background-size: 50px 50px;
	}
</style>
