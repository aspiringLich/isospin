<script lang="ts" context="module">
	export let window_width: number;
	export let window_height: number;
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import { draggable } from "@neodrag/svelte";
	import Window from "$lib/window/Window.svelte";
</script>

<div class="w-full h-full" bind:clientHeight={window_height} bind:clientWidth={window_width}>
	<Window title="Welcome">
		<h3>Welcome to FloppaOS!</h3>
	</Window>
</div>
