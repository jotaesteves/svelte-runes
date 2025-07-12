import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import ThemeToggle from './ThemeToggle.svelte';

// Mock the theme store
vi.mock('../stores/theme.js', () => ({
	themeStore: {
		subscribe: vi.fn((callback) => {
			callback('light');
			return () => {};
		}),
		toggle: vi.fn()
	}
}));

describe('ThemeToggle Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it('renders toggle button with correct aria-label', () => {
		const { getByRole } = render(ThemeToggle);
		const button = getByRole('button', { name: 'Toggle theme' });
		expect(button).toBeInTheDocument();
	});

	it('shows moon icon in light mode', () => {
		const { container } = render(ThemeToggle);
		// Look for moon icon path
		const moonIcon = container.querySelector('path[d*="M20.354 15.354A9"]');
		expect(moonIcon).toBeInTheDocument();
	});

	it('has proper animation classes', () => {
		const { getByRole } = render(ThemeToggle);
		const button = getByRole('button', { name: 'Toggle theme' });

		expect(button).toHaveClass('transition-all');
		expect(button).toHaveClass('duration-300');
	});

	it('has proper styling classes', () => {
		const { getByRole } = render(ThemeToggle);
		const button = getByRole('button', { name: 'Toggle theme' });

		expect(button).toHaveClass('rounded-lg');
		expect(button).toHaveClass('p-2');
	});
});
