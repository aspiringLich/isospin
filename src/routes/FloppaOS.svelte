<script lang="ts" context="module">
	import { writable } from "svelte/store";

	export let size = writable({ width: 0, height: 0 });
	export let desktop: HTMLElement;
</script>

<script lang="ts">
	import Desktop from "./Desktop.svelte";
	import { onMount } from "svelte";
	import { window_registry } from "$cpt/window/registry";

	onMount(() => {
		window_registry.spawn("welcome");
	});
</script>

<Desktop>
	<div
		class="w-full h-full"
		bind:clientHeight={$size.height}
		bind:clientWidth={$size.width}
		bind:this={desktop}
	/>
</Desktop>
