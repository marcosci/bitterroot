<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { World } from '@threlte/rapier';
	import Scene from './Scene.svelte';
	import Tweakpane from './Tweakpane.svelte';
	import ArrowKeys from './ArrowKeys.svelte';

	export let data;
</script>

<Tweakpane />

<ArrowKeys />
<div>
	<Canvas>
		<World>
			<Scene {data} />
		</World>
	</Canvas>
</div>

<style>
	div {
		height: 100%;
	}
</style>
