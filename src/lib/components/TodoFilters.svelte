<script lang="ts">
	type FilterType = 'all' | 'active' | 'completed';

	interface Props {
		filter: FilterType;
		totalCount: number;
		activeCount: number;
		completedCount: number;
		onFilterChange: (filter: FilterType) => void;
		onClearCompleted: () => void;
	}

	let { filter, totalCount, activeCount, completedCount, onFilterChange, onClearCompleted }: Props =
		$props();
</script>

<div
	class="animate-fade-in mb-6 rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800"
>
	<div class="flex items-center justify-between">
		<div class="flex gap-2">
			<button
				onclick={() => onFilterChange('all')}
				class="rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105 {filter === 'all'
					? 'animate-scale-in bg-blue-500 text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
			>
				All ({totalCount})
			</button>
			<button
				onclick={() => onFilterChange('active')}
				class="rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105 {filter === 'active'
					? 'animate-scale-in bg-blue-500 text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
			>
				Active ({activeCount})
			</button>
			<button
				onclick={() => onFilterChange('completed')}
				class="rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105 {filter ===
				'completed'
					? 'animate-scale-in bg-blue-500 text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
			>
				Completed ({completedCount})
			</button>
		</div>
		{#if completedCount > 0}
			<button
				onclick={onClearCompleted}
				class="animate-slide-in rounded-lg bg-red-500 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:shadow-lg dark:bg-red-600 dark:hover:bg-red-700"
			>
				Clear Completed
			</button>
		{/if}
	</div>
</div>
