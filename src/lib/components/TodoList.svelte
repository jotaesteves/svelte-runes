<script lang="ts">
	import type { Todo } from '../types/todo.js';
	import TodoItem from './TodoItem.svelte';

	interface Props {
		todos: Todo[];
		filter: 'all' | 'active' | 'completed';
		onToggle: (id: number) => void;
		onDelete: (id: number) => void;
	}

	let { todos, filter, onToggle, onDelete }: Props = $props();
</script>

<div
	class="animate-fade-in overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800"
>
	{#if todos.length === 0}
		<div class="animate-fade-in p-8 text-center text-gray-500 dark:text-gray-400">
			{#if filter === 'all'}
				<svg
					class="mx-auto mb-4 h-16 w-16 animate-bounce text-gray-300 dark:text-gray-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					></path>
				</svg>
				<p class="text-lg">No todos yet</p>
				<p class="text-sm">Add your first todo above to get started!</p>
			{:else}
				<p class="text-lg">No {filter} todos</p>
			{/if}
		</div>
	{:else}
		<ul class="divide-y divide-gray-200 dark:divide-gray-700">
			{#each todos as todo, index (todo.id)}
				<TodoItem {todo} {onToggle} {onDelete} />
			{/each}
		</ul>
	{/if}
</div>
