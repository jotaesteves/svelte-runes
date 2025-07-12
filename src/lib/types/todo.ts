export interface Todo {
	id: number;
	text: string;
	description?: string; // Optional description field for additional details
	completed: boolean;
	createdAt: Date;
}
