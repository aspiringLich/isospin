<script lang="ts">
	import floppaOS from "$lib/images/floppaOS.svg";
	import { fade } from "svelte/transition";
	import { cubicOut } from "svelte/easing";

	const fade_opt = {
		delay: 0,
		duration: 500,
		easing: cubicOut,
	};
</script>

<div
	class="fixed h-full w-full bg-black flex flex-col items-center justify-center z-50"
	transition:fade={fade_opt}
>
	<img class="w-64 md:w-96 lg:w-[30em]" src={floppaOS} alt="floppaOS logo" />
	<div class="h-32 flex items-center justify-center">
		<slot />
	</div>
</div>
