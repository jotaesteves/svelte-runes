import { expect, test } from '@playwright/test';

test.describe('Todo App E2E Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('displays the todo app interface', async ({ page }) => {
		// Check for main components
		await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Toggle theme' })).toBeVisible();
	});

	test('can add a new todo', async ({ page }) => {
		/**
		 * Test Description: Verifies the basic functionality of adding a new todo item.
		 * This test ensures that users can input text, click the add button, and see
		 * their todo appear in the list while the input is cleared for the next entry.
		 */
		const todoInput = page.getByPlaceholder('What needs to be done?');
		const addButton = page.getByRole('button', { name: 'Add' });

		// Add a new todo
		await todoInput.fill('Test todo item');
		await addButton.click();

		// Verify todo appears in the list
		await expect(page.getByText('Test todo item')).toBeVisible();

		// Verify input is cleared
		await expect(todoInput).toHaveValue('');
	});

	test('can add todo with Enter key', async ({ page }) => {
		const todoInput = page.getByPlaceholder('What needs to be done?');

		// Add a new todo with Enter key
		await todoInput.fill('Todo with Enter key');
		await todoInput.press('Enter');

		// Verify todo appears
		await expect(page.getByText('Todo with Enter key')).toBeVisible();
	});

	test('can mark todo as completed', async ({ page }) => {
		// Add a todo first
		await page.getByPlaceholder('What needs to be done?').fill('Complete me');
		await page.getByRole('button', { name: 'Add' }).click();

		// Mark as completed
		const checkbox = page.getByRole('button', { name: 'Mark as complete' });
		await checkbox.click();

		// Verify todo is marked as completed (should have line-through)
		const todoText = page.getByText('Complete me');
		await expect(todoText).toHaveClass(/line-through/);

		// Verify checkbox shows completed state
		await expect(page.getByRole('button', { name: 'Mark as incomplete' })).toBeVisible();
	});

	test('can delete a todo', async ({ page }) => {
		// Add a todo first
		await page.getByPlaceholder('What needs to be done?').fill('Delete me');
		await page.getByRole('button', { name: 'Add' }).click();

		// Delete the todo
		await page.getByRole('button', { name: 'Delete todo' }).click();

		// Verify todo is removed
		await expect(page.getByText('Delete me')).not.toBeVisible();
	});

	test('can filter todos', async ({ page }) => {
		/**
		 * Test Description: Tests the filtering functionality that allows users to view
		 * todos by different states (All, Active, Completed). This ensures that the
		 * filter buttons work correctly and display the appropriate todos.
		 */
		// Add multiple todos
		const todoInput = page.getByPlaceholder('What needs to be done?');
		const addButton = page.getByRole('button', { name: 'Add' });

		await todoInput.fill('Active todo');
		await addButton.click();

		await todoInput.fill('Completed todo');
		await addButton.click();

		// Mark second todo as completed
		const todos = page.getByRole('button', { name: 'Mark as complete' });
		await todos.last().click();

		// Test Active filter
		await page.getByRole('button', { name: /Active/ }).click();
		await expect(page.getByText('Active todo')).toBeVisible();
		await expect(page.getByText('Completed todo')).not.toBeVisible();

		// Test Completed filter
		await page.getByRole('button', { name: /^Completed \(/ }).click();
		await expect(page.getByText('Active todo')).not.toBeVisible();
		await expect(page.getByText('Completed todo')).toBeVisible();

		// Test All filter
		await page.getByRole('button', { name: /All/ }).click();
		await expect(page.getByText('Active todo')).toBeVisible();
		await expect(page.getByText('Completed todo')).toBeVisible();
	});

	test('displays correct statistics', async ({ page }) => {
		// Add multiple todos
		const todoInput = page.getByPlaceholder('What needs to be done?');
		const addButton = page.getByRole('button', { name: 'Add' });

		await todoInput.fill('Todo 1');
		await addButton.click();

		await todoInput.fill('Todo 2');
		await addButton.click();

		// Mark one as completed
		const checkbox = page.getByRole('button', { name: 'Mark as complete' }).first();
		await checkbox.click();

		// Check statistics
		await expect(page.getByText('Total').locator('..').getByText('2')).toBeVisible();
		await expect(
			page.locator('[class*="text-orange-500"]').filter({ hasText: '1' }).first()
		).toBeVisible();
		await expect(
			page.locator('[class*="text-green-500"]').filter({ hasText: '1' }).first()
		).toBeVisible();
	});

	test('can clear completed todos', async ({ page }) => {
		// Add and complete multiple todos
		const todoInput = page.getByPlaceholder('What needs to be done?');
		const addButton = page.getByRole('button', { name: 'Add' });

		await todoInput.fill('Todo 1');
		await addButton.click();

		await todoInput.fill('Todo 2');
		await addButton.click();

		// Mark both as completed
		const checkboxes = page.getByRole('button', { name: 'Mark as complete' });
		await checkboxes.first().click();
		await checkboxes.last().click();

		// Clear completed todos
		await page.getByRole('button', { name: 'Clear Completed' }).click();

		// Verify todos are removed
		await expect(page.getByText('Todo 1')).not.toBeVisible();
		await expect(page.getByText('Todo 2')).not.toBeVisible();

		// Verify clear button is hidden
		await expect(page.getByRole('button', { name: 'Clear Completed' })).not.toBeVisible();
	});

	test('can toggle theme', async ({ page }) => {
		const themeToggle = page.getByRole('button', { name: 'Toggle theme' });

		// Check initial theme (light mode)
		await expect(page.locator('html')).not.toHaveClass(/dark/);

		// Toggle to dark mode
		await themeToggle.click();
		await expect(page.locator('html')).toHaveClass(/dark/);

		// Toggle back to light mode
		await themeToggle.click();
		await expect(page.locator('html')).not.toHaveClass(/dark/);
	});

	test('preserves todos on page reload', async ({ page }) => {
		// Add a todo
		await page.getByPlaceholder('What needs to be done?').fill('Persistent todo');
		await page.getByRole('button', { name: 'Add' }).click();

		// Reload the page
		await page.reload();

		// Verify todo is still there
		await expect(page.getByText('Persistent todo')).toBeVisible();
	});

	test('shows empty state when no todos', async ({ page }) => {
		// Should show empty state initially
		await expect(page.getByText(/No todos yet/)).toBeVisible();
	});

	test('validates input requirements', async ({ page }) => {
		const addButton = page.getByRole('button', { name: 'Add' });

		// Button should be disabled when input is empty
		await expect(addButton).toBeDisabled();

		// Button should be enabled when input has content
		await page.getByPlaceholder('What needs to be done?').fill('Test');
		await expect(addButton).not.toBeDisabled();

		// Button should be disabled for whitespace-only input
		await page.getByPlaceholder('What needs to be done?').fill('   ');
		await expect(addButton).toBeDisabled();
	});

	test('displays creation timestamp', async ({ page }) => {
		/**
		 * Test Description: Verifies that each todo item displays a creation timestamp
		 * showing when it was added, helping users track when tasks were created.
		 */
		// Add a todo
		await page.getByPlaceholder('What needs to be done?').fill('Timestamped todo');
		await page.getByRole('button', { name: 'Add' }).click();

		// Check that creation date is displayed
		await expect(page.getByText(/Created/)).toBeVisible();
	});

	test('can add todo with description', async ({ page }) => {
		/**
		 * Test Description: Tests the new description functionality that allows users
		 * to add optional detailed descriptions to their todo items for better context.
		 */
		const todoInput = page.getByPlaceholder('What needs to be done?');
		const descriptionInput = page.getByPlaceholder('Add a description (optional)...');
		const addButton = page.getByRole('button', { name: 'Add' });

		// Add a todo with description
		await todoInput.fill('Buy groceries');
		await descriptionInput.fill('Need to buy milk, bread, and eggs for the week');
		await addButton.click();

		// Verify both title and description appear
		await expect(page.getByText('Buy groceries')).toBeVisible();
		await expect(page.getByText('Need to buy milk, bread, and eggs for the week')).toBeVisible();

		// Verify inputs are cleared
		await expect(todoInput).toHaveValue('');
		await expect(descriptionInput).toHaveValue('');
	});

	test('can add todo without description', async ({ page }) => {
		/**
		 * Test Description: Ensures that the description field is truly optional
		 * and todos can still be created without descriptions.
		 */
		const todoInput = page.getByPlaceholder('What needs to be done?');
		const addButton = page.getByRole('button', { name: 'Add' });

		// Add a todo without description
		await todoInput.fill('Simple todo');
		await addButton.click();

		// Verify todo appears
		await expect(page.getByText('Simple todo')).toBeVisible();

		// The description area should not show for this todo
		await expect(
			page
				.getByText('Simple todo')
				.locator('..')
				.getByText(/Need to buy milk/)
		).not.toBeVisible();
	});
});
