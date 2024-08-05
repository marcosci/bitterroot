<script>
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let isUpPressed = false;
	let isDownPressed = false;
	let isLeftPressed = false;
	let isRightPressed = false;

	function handleKeyDown(event) {
		switch (event.key) {
			case 'ArrowUp':
				isUpPressed = true;
				break;
			case 'ArrowDown':
				isDownPressed = true;
				break;
			case 'ArrowLeft':
				isLeftPressed = true;
				break;
			case 'ArrowRight':
				isRightPressed = true;
				break;
		}
	}

	function handleKeyUp(event) {
		switch (event.key) {
			case 'ArrowUp':
				isUpPressed = false;
				break;
			case 'ArrowDown':
				isDownPressed = false;
				break;
			case 'ArrowLeft':
				isLeftPressed = false;
				break;
			case 'ArrowRight':
				isRightPressed = false;
				break;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	});
</script>

<div class="absolute bottom-4 right-4 z-50 flex flex-col items-center justify-center space-y-4">
	<button
		class="button cursor-pointer border-none p-4 text-sm shadow-2xl {isUpPressed ? 'pressed' : ''}"
		>↑</button
	>
	<div class="flex space-x-4">
		<button
			class="button cursor-pointer border-none p-4 text-sm shadow-2xl {isLeftPressed
				? 'pressed'
				: ''}">←</button
		>
		<button
			class="button cursor-pointer border-none p-4 text-sm shadow-2xl {isDownPressed
				? 'pressed'
				: ''}">↓</button
		>
		<button
			class="button cursor-pointer border-none p-4 text-sm shadow-2xl shadow-indigo-500/50 {isRightPressed
				? 'pressed'
				: ''}">→</button
		>
	</div>
</div>

<style>
	:root {
		--highlight1: hsl(150, 3%, 39%);
		--highlight2: hsl(150, 2%, 51%);
		--shadow1: hsl(150, 1%, 27%);
		--shadow2: hsl(160, 4%, 16%);
	}

	.keys {
		margin: auto;
		text-align: center;
		line-height: 8rem;
		height: 16rem;
	}

	.button {
		display: inline-block;
		text-align: center;
		vertical-align: bottom;
		color: #232222;
		border-style: solid;
		border-width: 0.4rem 0.45rem 0.6rem;
		border-radius: 0.8rem;
		border-color: var(--highlight1) var(--shadow2) var(--shadow2) var(--shadow1);
		background: var(--highlight2);
		transition: all 80ms ease;
	}

	.pressed {
		border-bottom-width: 0.4rem;
		text-shadow: 0 0 10px white;
	}
</style>
