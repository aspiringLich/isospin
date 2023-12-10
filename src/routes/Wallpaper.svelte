<div class="w-full h-full bg-[var(--color-bg)] relative">
	<div class="grid fixed w-full h-full" />
	<slot />
</div>

<style lang="postcss">
	.grid {
		background-image: linear-gradient(
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
			);
		background-size: 50px 50px;
	}
</style>
