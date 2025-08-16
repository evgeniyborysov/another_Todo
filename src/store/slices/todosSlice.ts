import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
	createListAndRedirect,
	deleteListWithTasks,
	fetchTodoLists,
	removeSharedUserFromTodolist,
} from "./todosThunks";

export interface TodoList {
	name: string;
	id: string;
	ownerId: string;
	createdAt: string;
	sharedWith: [];
	description?: string;
}

export interface NewTodoList {
	name: string;
	ownerId: string;
	createdAt: string;
	sharedWith: [];
	description?: string;
}

interface TodosState {
	lists: TodoList[];
	loading: boolean;
	error: string | null;
}

const initialState: TodosState = {
	lists: [],
	loading: false,
	error: null,
};

const todosSlice = createSlice({
	name: "todos",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(
			createListAndRedirect.fulfilled,
			(state, action: PayloadAction<TodoList>) => {
				state.lists.push(action.payload);
			}
		);
		builder.addCase(
			fetchTodoLists.fulfilled,
			(_, action: PayloadAction<TodoList[]>) => {
				return { ..._, lists: action.payload };
			}
		);
		builder.addCase(
			deleteListWithTasks.fulfilled,
			(state, action: PayloadAction<string>) => {
				return {
					...state,
					lists: state.lists.filter(
						(list) => list.id !== action.payload
					),
				};
			}
		);
		builder.addCase(removeSharedUserFromTodolist.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(removeSharedUserFromTodolist.fulfilled, (state) => {
			state.loading = false;
		});
		builder.addCase(
			removeSharedUserFromTodolist.rejected,
			(state, action) => {
				state.loading = false;
				state.error = action.payload || "Ошибка при отзыве доступа";
			}
		);
	},
});

export default todosSlice.reducer;
