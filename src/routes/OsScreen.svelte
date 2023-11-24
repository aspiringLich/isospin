<script lang="ts">
	import floppaOS from "$lib/images/floppaOS.svg";
</script>

<div class="h-full w-full bg-black flex items-center justify-center">
	<div class="flex flex-col justify-center">
		<img class="w-64 md:w-96" src={floppaOS} alt="floppaOS logo" />
		<div class="h-32 flex items-center justify-center">
			<slot />
		</div>
	</div>
</div>
