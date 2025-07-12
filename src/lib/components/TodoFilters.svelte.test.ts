import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import TodoFilters from './TodoFilters.svelte';

describe('TodoFilters', () => {
	const mockProps = {
		filter: 'all' as const,
		totalCount: 5,
		activeCount: 3,
		completedCount: 2,
		onFilterChange: vi.fn(),
		onClearCompleted: vi.fn()
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it('renders all filter buttons with correct counts', () => {
		const { getByText } = render(TodoFilters, mockProps);

		expect(getByText('All (5)')).toBeInTheDocument();
		expect(getByText('Active (3)')).toBeInTheDocument();
		expect(getByText('Completed (2)')).toBeInTheDocument();
	});

	it('highlights the active filter', () => {
		const { getByText } = render(TodoFilters, {
			...mockProps,
			filter: 'active'
		});

		const activeButton = getByText('Active (3)');
		expect(activeButton).toHaveClass('bg-blue-500');
	});

	it('calls onFilterChange when filter button is clicked', async () => {
		const { getByText } = render(TodoFilters, mockProps);
		const activeButton = getByText('Active (3)');

		await fireEvent.click(activeButton);
		expect(mockProps.onFilterChange).toHaveBeenCalledWith('active');
	});

	it('shows clear completed button when there are completed todos', () => {
		const { getByText } = render(TodoFilters, mockProps);
		const clearButton = getByText('Clear Completed');
		expect(clearButton).toBeInTheDocument();
	});

	it('hides clear completed button when there are no completed todos', () => {
		const { queryByText } = render(TodoFilters, {
			...mockProps,
			completedCount: 0
		});
		const clearButton = queryByText('Clear Completed');
		expect(clearButton).not.toBeInTheDocument();
	});

	it('calls onClearCompleted when clear button is clicked', async () => {
		const { getByText } = render(TodoFilters, mockProps);
		const clearButton = getByText('Clear Completed');

		await fireEvent.click(clearButton);
		expect(mockProps.onClearCompleted).toHaveBeenCalled();
	});

	it('applies correct styling to all filter options', () => {
		const { getByText } = render(TodoFilters, mockProps);

		const allButton = getByText('All (5)');
		const activeButton = getByText('Active (3)');
		const completedButton = getByText('Completed (2)');

		// All button should be highlighted (active filter)
		expect(allButton).toHaveClass('bg-blue-500');

		// Other buttons should not be highlighted
		expect(activeButton).toHaveClass('bg-gray-100');
		expect(completedButton).toHaveClass('bg-gray-100');
	});

	it('updates button states when filter changes', () => {
		// Test initial state with 'all' filter
		const { getByText } = render(TodoFilters, mockProps);
		expect(getByText('All (5)')).toHaveClass('bg-blue-500');
		expect(getByText('Active (3)')).toHaveClass('bg-gray-100');

		cleanup();

		// Test with 'completed' filter
		const { getByText: getByText2 } = render(TodoFilters, {
			...mockProps,
			filter: 'completed'
		});

		expect(getByText2('All (5)')).toHaveClass('bg-gray-100');
		expect(getByText2('Completed (2)')).toHaveClass('bg-blue-500');
	});
});
