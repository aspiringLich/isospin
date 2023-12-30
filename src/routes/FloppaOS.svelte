<script lang="ts">
	import Desktop from "$cpt/desktop/Desktop.svelte";
	import { onMount } from "svelte";
	import { registry } from "$cpt/window/registry";

	onMount(() => {
		registry.spawn("welcome");
	});
</script>

<Desktop />
