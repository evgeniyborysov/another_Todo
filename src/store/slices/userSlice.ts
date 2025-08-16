import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface UserState {
	id: string | null;
	name: string | null;
	email: string | null;
	token: string | null;
	lastViewedListId?: string | null;
}

const initialState: UserState = {
	id: null,
	email: null,
	token: null,
	name: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<UserState>) {
			state.id = action.payload.id;
			state.email = action.payload.email;
			state.token = action.payload.token;
			state.name = action.payload.name;
		},
		removeUser(state) {
			state.email = null;
			state.token = null;
			state.id = null;
			state.name = null;
		},
	},
});

export const { setUser, removeUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
