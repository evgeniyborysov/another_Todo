import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createTask, deleteTask, fetchTasks, updateTask } from "./tasksThunks";

export interface Task {
	id: string;
	listId: string;
	text: string;
	completed: boolean;
	createdAt?: string;
}

export interface NewTask {
	listId: string;
	text: string;
	completed: boolean;
	createdAt?: string;
}

const initialState: Task[] = [];

export const tasksSlice = createSlice({
	name: "tasks",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(
			createTask.fulfilled,
			(state, action: PayloadAction<Task>) => {
				state.push(action.payload);
			}
		);
		builder.addCase(
			fetchTasks.fulfilled,
			(_, action: PayloadAction<Task[]>) => {
				return action.payload;
			}
		);
		builder.addCase(
			deleteTask.fulfilled,
			(state, action: PayloadAction<string>) => {
				return state.filter((task) => task.id !== action.payload);
			}
		);
		builder.addCase(
			updateTask.fulfilled,
			(state, action: PayloadAction<string>) => {
				return state.map((task) =>
					task.id === action.payload
						? { ...task, completed: !task.completed }
						: task
				);
			}
		);
	},
});

export default tasksSlice.reducer;
