import { writable } from 'svelte/store';

// Create a writable store for theme
const theme = writable<'light' | 'dark'>('light');

// Subscribe to theme changes to update DOM classes
theme.subscribe((currentTheme) => {
	updateDocumentClass(currentTheme);
});

// Theme store with persistence
export const themeStore = {
	// Subscribe method for reactive updates
	subscribe: theme.subscribe,

	// Get current value synchronously
	get current() {
		let currentTheme: 'light' | 'dark' = 'light';
		theme.subscribe((value) => (currentTheme = value))();
		return currentTheme;
	},

	toggle() {
		theme.update((currentTheme) => {
			const newTheme = currentTheme === 'light' ? 'dark' : 'light';
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('theme', newTheme);
			}
			return newTheme;
		});
	},

	set(newTheme: 'light' | 'dark') {
		theme.set(newTheme);
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('theme', newTheme);
		}
	},

	init() {
		if (typeof localStorage !== 'undefined') {
			const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
			if (savedTheme) {
				theme.set(savedTheme);
			} else {
				// Check system preference
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				const initialTheme = prefersDark ? 'dark' : 'light';
				theme.set(initialTheme);
			}
		}
	}
};

function updateDocumentClass(currentTheme: 'light' | 'dark') {
	if (typeof document !== 'undefined') {
		if (currentTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
}
