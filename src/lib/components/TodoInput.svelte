<script lang="ts">
	interface Props {
		value: string;
		onAdd: (text: string) => void;
		onUpdate: (value: string) => void;
	}

	let { value, onAdd, onUpdate }: Props = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleAdd();
		}
	}

	function handleAdd() {
		if (value.trim()) {
			onAdd(value.trim());
			onUpdate('');
		}
	}

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onUpdate(target.value);
	}
</script>

<div
	class="animate-fade-in mb-6 rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800"
>
	<div class="flex gap-4">
		<input
			{value}
			oninput={handleInput}
			onkeydown={handleKeydown}
			placeholder="What needs to be done?"
			class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 hover:shadow-md focus:scale-105 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
		/>
		<button
			onclick={handleAdd}
			disabled={!value.trim()}
			class="animate-slide-in rounded-lg bg-blue-500 px-6 py-3 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:bg-blue-600 dark:hover:bg-blue-700"
		>
			Add
		</button>
	</div>
</div>
