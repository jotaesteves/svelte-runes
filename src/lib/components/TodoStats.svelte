<script lang="ts">
	interface Props {
		totalCount: number;
		activeCount: number;
		completedCount: number;
	}

	let { totalCount, activeCount, completedCount }: Props = $props();
</script>

<div
	class="animate-fade-in mt-6 rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800"
>
	<div class="grid grid-cols-3 gap-4 text-center">
		<div class="transition-all duration-300 hover:scale-110">
			<p class="animate-bounce-in text-2xl font-bold text-blue-500 dark:text-blue-400">
				{totalCount}
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">Total</p>
		</div>
		<div class="transition-all duration-300 hover:scale-110">
			<p
				class="animate-bounce-in text-2xl font-bold text-orange-500 dark:text-orange-400"
				style="animation-delay: 0.1s;"
			>
				{activeCount}
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">Active</p>
		</div>
		<div class="transition-all duration-300 hover:scale-110">
			<p
				class="animate-bounce-in text-2xl font-bold text-green-500 dark:text-green-400"
				style="animation-delay: 0.2s;"
			>
				{completedCount}
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">Completed</p>
		</div>
	</div>
</div>
