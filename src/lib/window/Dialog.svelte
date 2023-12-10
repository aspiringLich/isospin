<script lang="ts">
	import Window from "$lib/window/Window.svelte";

	export let title: string;
	export let content: string;
</script>

<Window {title} {...$$restProps}>
	<div class="p-2 prose">
		{@html content}
	</div>
</Window>
