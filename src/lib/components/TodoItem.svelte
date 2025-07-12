<script lang="ts">
	import type { Todo } from '../types/todo.js';

	interface Props {
		todo: Todo;
		onToggle: (id: number) => void;
		onDelete: (id: number) => void;
	}

	let { todo, onToggle, onDelete }: Props = $props();
</script>

<li
	class="animate-fade-in p-4 transition-all duration-300 hover:scale-[1.01] hover:bg-gray-50 dark:hover:bg-gray-700"
>
	<div class="flex items-center gap-4">
		<button
			onclick={() => onToggle(todo.id)}
			aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
			class="h-6 w-6 flex-shrink-0 rounded-full border-2 transition-all duration-300 hover:scale-110 {todo.completed
				? 'animate-bounce-in border-green-500 bg-green-500'
				: 'border-gray-300 hover:border-green-400 dark:border-gray-600 dark:hover:border-green-500'}"
		>
			{#if todo.completed}
				<svg
					class="animate-scale-in mx-auto mt-0.5 h-4 w-4 text-white"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clip-rule="evenodd"
					></path>
				</svg>
			{/if}
		</button>
		<div class="min-w-0 flex-1">
			<p
				class="text-lg transition-all duration-300 {todo.completed
					? 'scale-95 transform text-gray-500 line-through dark:text-gray-400'
					: 'text-gray-900 dark:text-gray-100'}"
			>
				{todo.text}
			</p>
			<p class="mt-1 text-sm text-gray-500 transition-all duration-300 dark:text-gray-400">
				Created {todo.createdAt.toLocaleDateString()} at {todo.createdAt.toLocaleTimeString()}
			</p>
		</div>
		<button
			onclick={() => onDelete(todo.id)}
			aria-label="Delete todo"
			class="flex-shrink-0 rounded-lg p-2 text-red-500 transition-all duration-300 hover:scale-110 hover:rotate-6 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
				></path>
			</svg>
		</button>
	</div>
</li>
