<script>
	import App from '$lib/components/App.svelte';
	export let data;
</script>

<div class="h-screen overflow-hidden bg-slate-200">
	<div class="flex items-center space-x-4 p-4">
		<img src="/BitterrootLogoPNG.png" alt="Description of image" class="h-36" />
		<h1>Bitterroot</h1>
	</div>

	<div class="h-full">
		<App {data} />
	</div>
</div>

<style>
</style>
