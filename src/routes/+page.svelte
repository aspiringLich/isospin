<script lang="ts">
	import Startup from "./Startup.svelte";
	import OsScreen from "./OsScreen.svelte";
	import Timeout from "./Timeout.svelte";

	let n = 0;
	const inc = () => n++;
</script>

{#if n == 0}
	<Startup on:ready={inc} />
{:else if n == 1}
	<div class="w-full h-full bg-black" />
	<Timeout timeout={800} on:ready={inc} />
{:else if n == 2}
	<OsScreen />
{/if}
