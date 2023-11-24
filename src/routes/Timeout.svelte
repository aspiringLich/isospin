<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let timeout: number;

	let dispatch = createEventDispatcher();

	setTimeout(() => {
		dispatch("ready");
	}, timeout);
</script>
