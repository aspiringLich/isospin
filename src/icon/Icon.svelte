<script lang="ts">
	export let icon: number;
	export let size: number = 16;

	export { classes as class };
	let classes: string = "";
</script>

<span
	style:--x="-{(icon * 16) % 128}px"
	style:--y="-{Math.floor(icon / 128)}px"
	style:--scale={size / 16}
	class="icon {classes}"
/>

<style lang="postcss">
	.icon {
		@apply inline-block;
		width: calc(16px * var(--scale));
		height: calc(16px * var(--scale));
		image-rendering: pixelated;
		background-image: url("$icn/icon-sheet.png");
		background-position: calc(var(--x) * var(--scale)) calc(var(--y) * var(--scale));
		background-size: calc(128px * var(--scale)) calc(128px * var(--scale));
	}
</style>
