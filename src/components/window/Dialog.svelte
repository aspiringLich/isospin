<script lang="ts">
	import Window from "$src/components/window/Window.svelte";

	export let title: string;
	export let id: string;
	export let content: string;
</script>

<Window {title} {id} {...$$restProps} content={true}>
	{@html content}
</Window>
