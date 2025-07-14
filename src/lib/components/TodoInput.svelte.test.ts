import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import { tick } from 'svelte';
import TodoInput from './TodoInput.svelte';

describe('TodoInput Component', () => {
	const createProps = (overrides = {}) => ({
		value: '',
		description: '',
		onAdd: vi.fn(),
		onUpdate: vi.fn(),
		onUpdateDescription: vi.fn(),
		...overrides
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it('renders input with placeholder text', () => {
		const props = createProps();
		const { getByPlaceholderText } = render(TodoInput, props);
		const input = getByPlaceholderText('What needs to be done?');
		expect(input).toBeInTheDocument();
	});

	it('renders description textarea with placeholder text', () => {
		const props = createProps();
		const { getByPlaceholderText } = render(TodoInput, props);
		const textarea = getByPlaceholderText('Add a description (optional)...');
		expect(textarea).toBeInTheDocument();
	});

	it('renders add button', () => {
		const props = createProps();
		const { getByRole } = render(TodoInput, props);
		const button = getByRole('button', { name: 'Add' });
		expect(button).toBeInTheDocument();
	});

	it('displays current value in input', () => {
		const props = createProps({ value: 'Test todo' });
		const { getByDisplayValue } = render(TodoInput, props);
		const input = getByDisplayValue('Test todo');
		expect(input).toBeInTheDocument();
	});

	it('displays current description in textarea', () => {
		const props = createProps({ description: 'Test description' });
		const { getByDisplayValue } = render(TodoInput, props);
		const textarea = getByDisplayValue('Test description');
		expect(textarea).toBeInTheDocument();
	});

	it('calls onUpdate when input value changes', async () => {
		const props = createProps();
		const { getByPlaceholderText } = render(TodoInput, props);
		const input = getByPlaceholderText('What needs to be done?');

		await fireEvent.input(input, { target: { value: 'New todo' } });
		await tick();
		expect(props.onUpdate).toHaveBeenCalledWith('New todo');
	});

	it('calls onUpdateDescription when description value changes', async () => {
		const props = createProps();
		const { getByPlaceholderText } = render(TodoInput, props);
		const textarea = getByPlaceholderText('Add a description (optional)...');

		await fireEvent.input(textarea, { target: { value: 'New description' } });
		await tick();
		expect(props.onUpdateDescription).toHaveBeenCalledWith('New description');
	});

	it('calls onAdd when add button is clicked with valid input', async () => {
		const props = createProps({ value: 'Test todo' });
		const { getByRole } = render(TodoInput, props);
		const button = getByRole('button', { name: 'Add' });

		await fireEvent.click(button);
		await tick();
		expect(props.onAdd).toHaveBeenCalledWith('Test todo', '');
		expect(props.onUpdate).toHaveBeenCalledWith('');
		expect(props.onUpdateDescription).toHaveBeenCalledWith('');
	});

	it('calls onAdd when Enter key is pressed with valid input', async () => {
		const props = createProps({ value: 'Test todo' });
		const { getByPlaceholderText } = render(TodoInput, props);
		const input = getByPlaceholderText('What needs to be done?');

		await fireEvent.keyDown(input, { key: 'Enter' });
		await tick();
		expect(props.onAdd).toHaveBeenCalledWith('Test todo', '');
		expect(props.onUpdate).toHaveBeenCalledWith('');
		expect(props.onUpdateDescription).toHaveBeenCalledWith('');
	});

	it('calls onAdd with both text and description when provided', async () => {
		const props = createProps({ value: 'Test todo', description: 'Test description' });
		const { getByRole } = render(TodoInput, props);
		const button = getByRole('button', { name: 'Add' });

		await fireEvent.click(button);
		await tick();
		expect(props.onAdd).toHaveBeenCalledWith('Test todo', 'Test description');
		expect(props.onUpdate).toHaveBeenCalledWith('');
		expect(props.onUpdateDescription).toHaveBeenCalledWith('');
	});

	it('does not call onAdd when input is empty', async () => {
		const props = createProps({ value: '' });
		const { getByRole } = render(TodoInput, props);
		const button = getByRole('button', { name: 'Add' });

		await fireEvent.click(button);
		await tick();
		expect(props.onAdd).not.toHaveBeenCalled();
	});

	it('does not call onAdd when input contains only whitespace', async () => {
		const props = createProps({ value: '   ' });
		const { getByRole } = render(TodoInput, props);
		const button = getByRole('button', { name: 'Add' });

		await fireEvent.click(button);
		await tick();
		expect(props.onAdd).not.toHaveBeenCalled();
	});

	it('trims whitespace when adding todo', async () => {
		const props = createProps({ value: '  Test todo  ' });
		const { getByRole } = render(TodoInput, props);
		const button = getByRole('button', { name: 'Add' });

		await fireEvent.click(button);
		await tick();
		expect(props.onAdd).toHaveBeenCalledWith('Test todo', '');
	});

	it('disables add button when input is empty', () => {
		const props = createProps({ value: '' });
		const { getByRole } = render(TodoInput, props);
		const button = getByRole('button', { name: 'Add' });
		expect(button).toBeDisabled();
	});

	it('enables add button when input has content', () => {
		const props = createProps({ value: 'Test todo' });
		const { getByRole } = render(TodoInput, props);
		const button = getByRole('button', { name: 'Add' });
		expect(button).not.toBeDisabled();
	});
});
