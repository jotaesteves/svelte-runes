import { expect, test } from '@playwright/test';

test.describe('Todo App Accessibility Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('has proper ARIA labels and roles', async ({ page }) => {
		// Check for proper ARIA labels
		await expect(page.getByRole('button', { name: 'Toggle theme' })).toBeVisible();

		// Add a todo to test todo item accessibility
		await page.getByPlaceholder('What needs to be done?').fill('Accessible todo');
		await page.getByRole('button', { name: 'Add' }).click();

		await expect(page.getByRole('button', { name: 'Mark as complete' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Delete todo' })).toBeVisible();
	});

	test('supports keyboard navigation', async ({ page }) => {
		const todoInput = page.getByPlaceholder('What needs to be done?');

		// Focus input with Tab
		await page.keyboard.press('Tab');
		await expect(todoInput).toBeFocused();

		// Add todo with Enter
		await todoInput.fill('Keyboard todo');
		await page.keyboard.press('Enter');

		// Verify todo was added
		await expect(page.getByText('Keyboard todo')).toBeVisible();
	});

	test('maintains focus management', async ({ page }) => {
		// Add a todo
		await page.getByPlaceholder('What needs to be done?').fill('Focus test');
		await page.getByRole('button', { name: 'Add' }).click();

		// Focus should return to input after adding
		await expect(page.getByPlaceholder('What needs to be done?')).toBeFocused();
	});
});

test.describe('Todo App Animation Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('animations work correctly', async ({ page }) => {
		// Check for animation classes on components
		const container = page.locator('.animate-fade-in').first();
		await expect(container).toBeVisible();

		// Add a todo and check for animation classes
		await page.getByPlaceholder('What needs to be done?').fill('Animated todo');
		await page.getByRole('button', { name: 'Add' }).click();

		// Todo item should have animation classes
		const todoItem = page.locator('li').filter({ hasText: 'Animated todo' });
		await expect(todoItem).toHaveClass(/animate-fade-in/);
	});

	test('theme toggle animations work', async ({ page }) => {
		const themeToggle = page.getByRole('button', { name: 'Toggle theme' });

		// Check for transition classes
		await expect(themeToggle).toHaveClass(/transition-all/);
		await expect(themeToggle).toHaveClass(/duration-300/);
	});

	test('hover effects work correctly', async ({ page }) => {
		// Add a todo to test hover effects
		await page.getByPlaceholder('What needs to be done?').fill('Hover test');
		await page.getByRole('button', { name: 'Add' }).click();

		// Hover over todo item
		const todoItem = page.locator('li').filter({ hasText: 'Hover test' });
		await todoItem.hover();

		// Check for hover classes (these should be applied via CSS)
		await expect(todoItem).toHaveClass(/hover:scale-\[1\.01\]/);
	});
});

test.describe('Todo App Responsive Design Tests', () => {
	test('works on mobile viewport', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// All elements should still be visible and functional
		await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Toggle theme' })).toBeVisible();

		// Add a todo on mobile
		await page.getByPlaceholder('What needs to be done?').fill('Mobile todo');
		await page.getByRole('button', { name: 'Add' }).click();

		await expect(page.getByText('Mobile todo')).toBeVisible();
	});

	test('works on tablet viewport', async ({ page }) => {
		// Set tablet viewport
		await page.setViewportSize({ width: 768, height: 1024 });
		await page.goto('/');

		// Test functionality on tablet
		await page.getByPlaceholder('What needs to be done?').fill('Tablet todo');
		await page.getByRole('button', { name: 'Add' }).click();

		await expect(page.getByText('Tablet todo')).toBeVisible();
	});

	test('works on desktop viewport', async ({ page }) => {
		// Set desktop viewport
		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.goto('/');

		// Test functionality on desktop
		await page.getByPlaceholder('What needs to be done?').fill('Desktop todo');
		await page.getByRole('button', { name: 'Add' }).click();

		await expect(page.getByText('Desktop todo')).toBeVisible();
	});
});

test.describe('Todo App Data Persistence Tests', () => {
	test('persists theme preference', async ({ page }) => {
		await page.goto('/');

		// Toggle to dark mode
		await page.getByRole('button', { name: 'Toggle theme' }).click();
		await expect(page.locator('html')).toHaveClass(/dark/);

		// Reload page
		await page.reload();

		// Theme should still be dark
		await expect(page.locator('html')).toHaveClass(/dark/);
	});

	test('persists todos in localStorage', async ({ page }) => {
		await page.goto('/');

		// Add multiple todos
		await page.getByPlaceholder('What needs to be done?').fill('Persistent todo 1');
		await page.getByRole('button', { name: 'Add' }).click();

		await page.getByPlaceholder('What needs to be done?').fill('Persistent todo 2');
		await page.getByRole('button', { name: 'Add' }).click();

		// Mark one as completed
		await page.getByRole('button', { name: 'Mark as complete' }).first().click();

		// Reload page
		await page.reload();

		// All todos should still be there with correct states
		await expect(page.getByText('Persistent todo 1')).toBeVisible();
		await expect(page.getByText('Persistent todo 2')).toBeVisible();

		// Check that completed state is preserved
		const completedTodo = page.getByText('Persistent todo 1');
		await expect(completedTodo).toHaveClass(/line-through/);
	});
});

test.describe('Todo App Edge Cases', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('handles very long todo text', async ({ page }) => {
		const longText =
			'This is a very long todo item that tests how the application handles lengthy text content and ensures proper text wrapping and display without breaking the layout or causing overflow issues in the user interface';

		await page.getByPlaceholder('What needs to be done?').fill(longText);
		await page.getByRole('button', { name: 'Add' }).click();

		await expect(page.getByText(longText)).toBeVisible();
	});

	test('handles special characters in todos', async ({ page }) => {
		const specialText = '!@#$%^&*()_+-=[]{}|;":,./<>?`~éñüñ中文🎉';

		await page.getByPlaceholder('What needs to be done?').fill(specialText);
		await page.getByRole('button', { name: 'Add' }).click();

		await expect(page.getByText(specialText)).toBeVisible();
	});

	test('handles rapid interactions', async ({ page }) => {
		// Rapidly add multiple todos
		for (let i = 0; i < 5; i++) {
			await page.getByPlaceholder('What needs to be done?').fill(`Rapid todo ${i + 1}`);
			await page.getByRole('button', { name: 'Add' }).click();
		}

		// All todos should be added
		for (let i = 0; i < 5; i++) {
			await expect(page.getByText(`Rapid todo ${i + 1}`)).toBeVisible();
		}

		// Rapidly toggle completion
		const checkboxes = page.getByRole('button', { name: 'Mark as complete' });
		const count = await checkboxes.count();
		for (let i = 0; i < count; i++) {
			await checkboxes.nth(i).click();
		}

		// Check statistics updated correctly
		await expect(page.getByText('Completed').locator('..').getByText('5')).toBeVisible();
	});

	test('handles empty filter states correctly', async ({ page }) => {
		// Test active filter with no active todos
		await page.getByPlaceholder('What needs to be done?').fill('Complete me');
		await page.getByRole('button', { name: 'Add' }).click();

		// Mark as completed
		await page.getByRole('button', { name: 'Mark as complete' }).click();

		// Switch to active filter - should show empty state
		await page.getByRole('button', { name: /Active/ }).click();
		await expect(page.getByText(/No active todos/)).toBeVisible();

		// Switch to completed filter - should show the completed todo
		await page.getByRole('button', { name: /Completed/ }).click();
		await expect(page.getByText('Complete me')).toBeVisible();
	});
});
