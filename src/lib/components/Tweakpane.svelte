<script lang="ts">
	import { cn } from '$helpers';
	import { createTabs, createSwitch, melt } from '@melt-ui/svelte';
	import { cubicInOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import Switches from './Switches.svelte';

	const {
		elements: { root, list, content, trigger },
		states: { value }
	} = createTabs({
		defaultValue: 'tab-1'
	});

	let className = '';
	export { className as class };

	const triggers = [
		{ id: 'tab-1', title: 'Landscape' },
		{ id: 'tab-2', title: 'Loot' },
		{ id: 'tab-3', title: 'Player' }
	];

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut
	});
</script>

<div class="absolute right-4 top-4 z-50 w-72">
	<div
		use:melt={$root}
		class={cn(
			'flex flex-col overflow-hidden rounded-xl  shadow-lg  data-[orientation=vertical]:flex-row',
			className
		)}
	>
		<div
			use:melt={$list}
			class="flex shrink-0 overflow-x-auto bg-gray-500
      data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r"
			aria-label="Manage your account"
		>
			{#each triggers as triggerItem}
				<button use:melt={$trigger(triggerItem.id)} class="trigger relative">
					{triggerItem.title}
					{#if $value === triggerItem.id}
						<div
							in:send={{ key: 'trigger' }}
							out:receive={{ key: 'trigger' }}
							class="absolute bottom-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-magnum-400"
						/>
					{/if}
				</button>
			{/each}
		</div>
		<div use:melt={$content('tab-1')} class="grow bg-gray-500 p-5">
			<Switches />
		</div>
		<div use:melt={$content('tab-2')} class="grow bg-white p-5">
			<p class="mb-5 leading-normal text-neutral-900">
				Change your password here. Click save when you're done.
			</p>
			<fieldset class="mb-4 flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-sm leading-none text-neutral-900" for="newPassword">
					New password
				</label>
				<input id="newPassword" type="password" />
			</fieldset>
			<div class="mt-5 flex justify-end">
				<button class="save">Save changes</button>
			</div>
		</div>
		<div use:melt={$content('tab-3')} class="grow bg-white p-5">
			<p class="mb-5 leading-normal text-neutral-900">
				Change your settings here. Click save when you're done.
			</p>

			<fieldset class="mb-4 flex w-full flex-col justify-start">
				<label class="mb-2.5 block text-sm leading-none text-neutral-900" for="newEmail">
					New email
				</label>
				<input id="newEmail" type="email" />
			</fieldset>
			<div class="mt-5 flex justify-end">
				<button class="save">Save changes</button>
			</div>
		</div>
	</div>
</div>

<style>
	.trigger {
		display: flex;
		align-items: center;
		justify-content: center;

		cursor: default;
		user-select: none;

		border-radius: 0;
		background-color: theme(colors.neutral.100);

		color: theme(colors.neutral.900);
		font-weight: 500;
		line-height: 1;

		flex: 1;
		height: theme(spacing.12);
		padding-inline: theme(spacing.2);

		&:focus {
			position: relative;
		}

		&:focus-visible {
			@apply z-10 ring-2;
		}

		&[data-state='active'] {
			@apply focus:relative;
			background-color: white;
			color: theme('colors.magnum.900');
		}
	}

	button {
		--w: 2.75rem;
		--padding: 0.125rem;
		width: var(--w);
	}

	.thumb {
		--size: 1.25rem;
		width: var(--size);
		height: var(--size);
		transform: translateX(var(--padding));
	}

	:global([data-state='checked']) .thumb {
		transform: translateX(calc(var(--w) - var(--size) - var(--padding)));
	}
</style>
