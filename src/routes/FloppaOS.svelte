<script lang="ts" context="module">
	import { writable } from "svelte/store";

	export let size = writable({ width: 0, height: 0 });
	export let desktop: HTMLElement;
</script>

<script lang="ts">
	import Wallpaper from "./Wallpaper.svelte";
	import { onMount } from "svelte";
	import { window_registry } from "$cpt/window/registry";

	onMount(() => {
		window_registry.spawn("welcome");
	});
</script>

<Wallpaper>
	<div
		class="w-full h-full"
		bind:clientHeight={$size.height}
		bind:clientWidth={$size.width}
		bind:this={desktop}
	/>
</Wallpaper>
