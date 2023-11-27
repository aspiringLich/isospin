<script lang="ts">
	import { onMount } from "svelte";
	import { draggable, type DragOptions } from "@neodrag/svelte";

	export let title: string;

	const window_opts: DragOptions = {
		bounds: "parent",
	};
</script>

<div use:draggable={window_opts} class="window prose">
	<div class="titlebar flex flex-row-reverse">
		<span>{title}</span>
	</div>
	<slot />
</div>

<style lang="postcss">
	.window {
		@apply bg-slate-200 border-2 border-slate-400;
		font-family: "";
	}
</style>
