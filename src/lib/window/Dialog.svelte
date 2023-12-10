<script lang="ts">
	import Window from "$lib/window/Window.svelte";

	export let title: string;
</script>

<Window {title}>
	<slot />
</Window>
