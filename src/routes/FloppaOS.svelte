<script lang="ts" context="module">
	export let window_width: number;
	export let window_height: number;
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import Window from "$lib/window/Window.svelte";
	import { window_registry } from "$lib/window/registry";

	let element: HTMLElement;

	onMount(() => {
		window_registry.spawn("welcome", element);
	});
</script>

<div
	class="w-full h-full"
	bind:clientHeight={window_height}
	bind:clientWidth={window_width}
	bind:this={element}
/>
