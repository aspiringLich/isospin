<script lang="ts" context="module">
	import { writable } from "svelte/store";

	export let size = writable({ width: 0, height: 0 });
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
	bind:clientHeight={$size.height}
	bind:clientWidth={$size.width}
	bind:this={element}
/>
