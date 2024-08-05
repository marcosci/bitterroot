<script>
	import App from '$lib/components/App.svelte';
	export let data;
</script>

<div class="h-screen overflow-hidden bg-slate-200">
	<div class="absolute left-4 top-4 z-50">
		<img src="/BitterrootLogoPNG.png" alt="Description of image" class="h-36" />
	</div>

	<div class="h-full">
		<App {data} />
	</div>
</div>

<style>
</style>
