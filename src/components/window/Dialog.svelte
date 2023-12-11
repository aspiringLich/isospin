<script lang="ts">
	import Window from "$src/components/window/Window.svelte";

	export let title: string;
	export let content: string;
</script>

<Window {title} {...$$restProps}>
	<div class="p-2 prose overflow-scroll">
		{@html content}
	</div>
</Window>
