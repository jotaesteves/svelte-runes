import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import { tick } from 'svelte';
import TodoItem from './TodoItem.svelte';
import type { Todo } from '../types/todo.js';

describe('TodoItem Component', () => {
	const mockTodo: Todo = {
		id: 1,
		text: 'Test todo',
		completed: false,
		createdAt: new Date('2025-01-01T10:00:00Z')
	};

	const createProps = (overrides = {}) => ({
		todo: mockTodo,
		onToggle: vi.fn(),
		onDelete: vi.fn(),
		...overrides
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it('renders todo text correctly', async () => {
		const props = createProps();
		const { getByText } = render(TodoItem, props);

		expect(getByText('Test todo')).toBeInTheDocument();
	});

	it('displays creation date and time', async () => {
		const props = createProps();
		const { getByText } = render(TodoItem, props);

		const dateElement = getByText(/Created/);
		expect(dateElement).toBeInTheDocument();
	});

	it('calls onToggle when checkbox is clicked', async () => {
		const props = createProps();
		const { getByRole } = render(TodoItem, props);

		const checkbox = getByRole('button', { name: /Mark as complete/ });
		await fireEvent.click(checkbox);
		await tick();

		expect(props.onToggle).toHaveBeenCalledWith(1);
	});

	it('calls onDelete when delete button is clicked', async () => {
		const props = createProps();
		const { getByRole } = render(TodoItem, props);

		const deleteButton = getByRole('button', { name: /Delete todo/ });
		await fireEvent.click(deleteButton);
		await tick();

		expect(props.onDelete).toHaveBeenCalledWith(1);
	});

	it('shows completed state when todo is completed', async () => {
		const completedTodo = { ...mockTodo, completed: true };
		const props = createProps({ todo: completedTodo });
		const { getByRole } = render(TodoItem, props);

		const checkbox = getByRole('button', { name: /Mark as incomplete/ });
		expect(checkbox).toBeInTheDocument();
	});

	it('applies correct styling for completed todos', async () => {
		const completedTodo = { ...mockTodo, completed: true };
		const props = createProps({ todo: completedTodo });
		const { getByText } = render(TodoItem, props);

		const todoText = getByText('Test todo');
		expect(todoText).toHaveClass('line-through');
	});

	it('applies correct styling for incomplete todos', async () => {
		const props = createProps();
		const { getByText } = render(TodoItem, props);

		const todoText = getByText('Test todo');
		expect(todoText).not.toHaveClass('line-through');
	});

	it('shows checkmark icon when todo is completed', async () => {
		const completedTodo = { ...mockTodo, completed: true };
		const props = createProps({ todo: completedTodo });
		const { container } = render(TodoItem, props);

		const checkmarkSvg = container.querySelector('svg path[fill-rule="evenodd"]');
		expect(checkmarkSvg).toBeInTheDocument();
	});
});
