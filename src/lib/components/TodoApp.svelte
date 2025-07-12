<script lang="ts">
	import { onMount } from 'svelte';
	import type { Todo } from '../types/todo.js';
	import TodoInput from './TodoInput.svelte';
	import TodoFilters from './TodoFilters.svelte';
	import TodoList from './TodoList.svelte';
	import TodoStats from './TodoStats.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import { themeStore } from '../stores/theme.js';

	let todos = $state<Todo[]>([]);
	let newTodoText = $state('');
	let newTodoDescription = $state('');
	let filter = $state<'all' | 'active' | 'completed'>('all');

	// Derived states
	let filteredTodos = $derived.by(() => {
		switch (filter) {
			case 'active':
				return todos.filter((todo) => !todo.completed);
			case 'completed':
				return todos.filter((todo) => todo.completed);
			default:
				return todos;
		}
	});

	let completedCount = $derived(todos.filter((todo) => todo.completed).length);
	let activeCount = $derived(todos.filter((todo) => !todo.completed).length);

	// Load todos from localStorage on mount
	onMount(() => {
		// Initialize theme
		themeStore.init();

		const savedTodos = localStorage.getItem('todos');
		if (savedTodos) {
			todos = JSON.parse(savedTodos).map((todo: any) => ({
				...todo,
				createdAt: new Date(todo.createdAt)
			}));
		}
	});

	// Save todos to localStorage whenever todos change
	$effect(() => {
		localStorage.setItem('todos', JSON.stringify(todos));
	});

	function addTodo(text: string, description?: string) {
		const newTodo: Todo = {
			id: Date.now(),
			text,
			description,
			completed: false,
			createdAt: new Date()
		};
		todos = [...todos, newTodo];
	}

	function toggleTodo(id: number) {
		todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
	}

	function deleteTodo(id: number) {
		todos = todos.filter((todo) => todo.id !== id);
	}

	function clearCompleted() {
		todos = todos.filter((todo) => !todo.completed);
	}

	function updateNewTodoText(value: string) {
		newTodoText = value;
	}

	function updateNewTodoDescription(description: string) {
		newTodoDescription = description;
	}

	function handleFilterChange(newFilter: 'all' | 'active' | 'completed') {
		filter = newFilter;
	}
</script>

<div class="mx-auto max-w-2xl">
	<!-- Header -->
	<div class="mb-8 flex items-center justify-between">
		<div class="flex-1 text-center">
			<h1 class="mb-2 text-4xl font-bold text-gray-800 dark:text-gray-100">Todo App</h1>
			<p class="text-gray-600 dark:text-gray-300">Stay organized and get things done</p>
		</div>
		<ThemeToggle />
	</div>

	<!-- Add Todo Form -->
	<TodoInput
		value={newTodoText}
		description={newTodoDescription}
		onAdd={addTodo}
		onUpdate={updateNewTodoText}
		onUpdateDescription={updateNewTodoDescription}
	/>

	<!-- Filters -->
	<TodoFilters
		{filter}
		totalCount={todos.length}
		{activeCount}
		{completedCount}
		onFilterChange={handleFilterChange}
		onClearCompleted={clearCompleted}
	/>

	<!-- Todo List -->
	<TodoList todos={filteredTodos} {filter} onToggle={toggleTodo} onDelete={deleteTodo} />

	<!-- Statistics -->
	{#if todos.length > 0}
		<TodoStats totalCount={todos.length} {activeCount} {completedCount} />
	{/if}
</div>
