import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import TodoStats from './TodoStats.svelte';

describe('TodoStats', () => {
	const mockProps = {
		totalCount: 10,
		activeCount: 6,
		completedCount: 4,
	};

	afterEach(() => {
		cleanup();
	});

	it('displays total count correctly', () => {
		const { container } = render(TodoStats, mockProps);
		const totalSection = container.querySelector('.text-blue-500');
		expect(totalSection).toHaveTextContent('10');
		const totalLabel = totalSection?.parentElement?.querySelector('.text-sm');
		expect(totalLabel).toHaveTextContent('Total');
	});

	it('displays active count correctly', () => {
		const { container } = render(TodoStats, mockProps);
		const activeSection = container.querySelector('.text-orange-500');
		expect(activeSection).toHaveTextContent('6');
		const activeLabel = activeSection?.parentElement?.querySelector('.text-sm');
		expect(activeLabel).toHaveTextContent('Active');
	});

	it('displays completed count correctly', () => {
		const { container } = render(TodoStats, mockProps);
		const completedSection = container.querySelector('.text-green-500');
		expect(completedSection).toHaveTextContent('4');
		const completedLabel = completedSection?.parentElement?.querySelector('.text-sm');
		expect(completedLabel).toHaveTextContent('Completed');
	});

	it('applies correct color classes to stats', () => {
		const { container } = render(TodoStats, mockProps);

		const totalStat = container.querySelector('.text-blue-500');
		const activeStat = container.querySelector('.text-orange-500');
		const completedStat = container.querySelector('.text-green-500');

		expect(totalStat).toHaveClass('text-blue-500');
		expect(activeStat).toHaveClass('text-orange-500');
		expect(completedStat).toHaveClass('text-green-500');
	});

	it('handles zero counts correctly', () => {
		const { container } = render(TodoStats, {
			totalCount: 0,
			activeCount: 0,
			completedCount: 0,
		});

		const totalSection = container.querySelector('.text-blue-500');
		expect(totalSection).toHaveTextContent('0');
	});

	it('maintains grid layout structure', () => {
		const { container } = render(TodoStats, mockProps);
		const grid = container.querySelector('.grid-cols-3');
		expect(grid).toBeInTheDocument();
	});

	it('displays all three stat categories', () => {
		const { container } = render(TodoStats, mockProps);

		const totalLabel = container.querySelector('.text-blue-500')?.parentElement?.querySelector('.text-sm');
		const activeLabel = container.querySelector('.text-orange-500')?.parentElement?.querySelector('.text-sm');
		const completedLabel = container.querySelector('.text-green-500')?.parentElement?.querySelector('.text-sm');

		expect(totalLabel).toHaveTextContent('Total');
		expect(activeLabel).toHaveTextContent('Active');
		expect(completedLabel).toHaveTextContent('Completed');
	});

	it('renders with proper animation classes', () => {
		const { container } = render(TodoStats, mockProps);
		const statsContainer = container.querySelector('.animate-fade-in');
		expect(statsContainer).toBeInTheDocument();
	});
});
