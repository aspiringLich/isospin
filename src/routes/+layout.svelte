<script>
	import "./styles.css";
</script>

<div class="grid-bg" />
	<div class="fixed w-full h-[100vw]">
		<div class="flex h-full align-center justify-center"><slot /></div>
	</div>

<style lang="postcss">
	.grid-bg::after {
		@apply fixed left-0 w-full h-full;

		content: "";
		background: radial-gradient(rgb(var(--color-bg) / 0.8) 10%, transparent 100%);
	}

	.grid-bg {
		@apply fixed left-0 w-full h-full;

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
			rgb(var(--color-bg));
		background-size: 50px 50px;
	}
</style>
