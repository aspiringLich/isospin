<script lang="ts">
	import Startup from "./Startup.svelte";
	import OsScreen from "./OsScreen.svelte";
	import Timeout from "./Timeout.svelte";
	import FloppaOS from "./FloppaOS.svelte";

	import floppaOS from "$img/floppaOS.svg";
	import { onMount } from "svelte";
	import { preload_images } from "$src/lib/utils";

	let n = 3;
	const inc = () => n++;

	onMount(() => {
		preload_images(floppaOS);
	});
</script>

{#if n == 0}
	<Startup on:ready={inc} />
{:else if n == 1}
	<Timeout timeout={800} on:ready={inc} />
{:else if n == 2}
	<OsScreen />
	<Timeout timeout={5000} on:ready={inc} />
{:else if n == 3}
	<FloppaOS />
{/if}
