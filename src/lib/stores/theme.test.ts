import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { themeStore } from './theme.js';

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};

// Mock document
const documentMock = {
	documentElement: {
		classList: {
			add: vi.fn(),
			remove: vi.fn(),
			contains: vi.fn()
		}
	}
};

// Mock window.matchMedia
const matchMediaMock = vi.fn().mockImplementation((query) => ({
	matches: false,
	media: query,
	onchange: null,
	addListener: vi.fn(),
	removeListener: vi.fn(),
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	dispatchEvent: vi.fn()
}));

beforeEach(() => {
	vi.clearAllMocks();
	// @ts-expect-error - Mocking global localStorage
	global.localStorage = localStorageMock;
	// @ts-expect-error - Mocking global document
	global.document = documentMock;
	// @ts-expect-error - Mocking global window
	global.window = { matchMedia: matchMediaMock };
});

describe('themeStore', () => {
	it('should initialize with light theme by default', () => {
		const theme = get(themeStore);
		expect(theme).toBe('light');
	});

	it('should toggle between light and dark themes', () => {
		// Start with light theme
		expect(get(themeStore)).toBe('light');

		// Toggle to dark
		themeStore.toggle();
		expect(get(themeStore)).toBe('dark');

		// Toggle back to light
		themeStore.toggle();
		expect(get(themeStore)).toBe('light');
	});

	it('should set specific theme', () => {
		themeStore.set('dark');
		expect(get(themeStore)).toBe('dark');

		themeStore.set('light');
		expect(get(themeStore)).toBe('light');
	});

	it('should save theme to localStorage when set', () => {
		themeStore.set('dark');
		expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');

		themeStore.set('light');
		expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
	});

	it('should update document class when theme changes', () => {
		themeStore.set('dark');
		expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith('dark');

		themeStore.set('light');
		expect(documentMock.documentElement.classList.remove).toHaveBeenCalledWith('dark');
	});

	it('should load saved theme from localStorage on init', () => {
		localStorageMock.getItem.mockReturnValue('dark');

		themeStore.init();
		expect(get(themeStore)).toBe('dark');
		expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
	});

	it('should use system preference when no saved theme exists', () => {
		localStorageMock.getItem.mockReturnValue(null);
		matchMediaMock.mockReturnValue({ matches: true }); // Prefers dark mode

		themeStore.init();
		expect(get(themeStore)).toBe('dark');
	});

	it('should default to light theme when no saved theme and no system preference', () => {
		localStorageMock.getItem.mockReturnValue(null);
		matchMediaMock.mockReturnValue({ matches: false }); // Prefers light mode

		themeStore.init();
		expect(get(themeStore)).toBe('light');
	});
});
