<script lang="ts">
	import { themeStore } from '../stores/theme.js';

	// Subscribe to the store directly - this should work with Svelte 5
	$: isDark = $themeStore === 'dark';

	// Debug function to test theme toggle
	function handleToggle() {
		console.log('Theme toggle clicked, current theme:', $themeStore);
		themeStore.toggle();
		console.log('After toggle, new theme:', $themeStore);
		console.log('Document has dark class:', document.documentElement.classList.contains('dark'));
	}
</script>

<button
	onclick={handleToggle}
	aria-label="Toggle theme"
	class="rounded-lg p-2 transition-all duration-300 hover:scale-110 hover:shadow-lg {isDark
		? 'animate-scale-in bg-gray-700 text-yellow-400 hover:bg-gray-600'
		: 'animate-scale-in bg-gray-100 text-gray-600 hover:bg-gray-200'}"
>
	{#if isDark}
		<!-- Sun icon -->
		<svg
			class="h-5 w-5 animate-spin"
			style="animation-duration: 2s;"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			></path>
		</svg>
	{:else}
		<!-- Moon icon -->
		<svg
			class="h-5 w-5 transition-transform duration-300 hover:rotate-12"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			></path>
		</svg>
	{/if}
</button>
