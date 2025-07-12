// place files you want to import through the `$lib` alias in this folder.

// Export components
export { default as TodoApp } from './components/TodoApp.svelte';
export { default as TodoInput } from './components/TodoInput.svelte';
export { default as TodoFilters } from './components/TodoFilters.svelte';
export { default as TodoList } from './components/TodoList.svelte';
export { default as TodoItem } from './components/TodoItem.svelte';
export { default as TodoStats } from './components/TodoStats.svelte';

// Export types
export type { Todo } from './types/todo.js';
