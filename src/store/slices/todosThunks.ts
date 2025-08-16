import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	collection,
	addDoc,
	getDocs,
	query,
	where,
	deleteDoc,
	doc,
	updateDoc,
	arrayUnion,
	getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import type { TodoList } from "./todosSlice";
import type { NavigateFunction } from "react-router-dom";

export const fetchTodoLists = createAsyncThunk(
	"todos/fetchTodoLists",
	async (userId: string) => {
		try {
			const ownedQuery = query(
				collection(db, "lists"),
				where("ownerId", "==", userId)
			);
			const sharedQuery = query(
				collection(db, "lists"),
				where("sharedWith", "array-contains", userId)
			);
			const [ownedSnapshot, sharedSnapshot] = await Promise.all([
				getDocs(ownedQuery),
				getDocs(sharedQuery),
			]);
			const allTodolistsMap = new Map<string, TodoList>();
			ownedSnapshot.docs.forEach((doc) => {
				allTodolistsMap.set(doc.id, {
					id: doc.id,
					...doc.data(),
				} as TodoList);
			});
			sharedSnapshot.docs.forEach((doc) => {
				allTodolistsMap.set(doc.id, {
					id: doc.id,
					...doc.data(),
				} as TodoList); // Map автоматично впорається з дублікатами за ID
			});
			const finalTodolists = Array.from(allTodolistsMap.values());
			return finalTodolists;
		} catch (e) {
			console.error("Помилка отримання документів: ", e);
			throw e;
		}
	}
);

// export const createList = createAsyncThunk<
// 	TodoList,
// 	{ title: string; ownerId: string }
// >("todos/createList", async ({ title, ownerId }) => {
// 	const newTodo: NewTodoList = {
// 		name: title.trim(),
// 		ownerId: ownerId,
// 		createdAt: new Date().toISOString(),
// 	};
// 	try {
// 		const docRef = await addDoc(collection(db, "lists"), newTodo);
// 		console.log("Документ додано з ID: ", docRef.id);
// 		return {
// 			...newTodo,
// 			id: docRef.id,
// 		} as TodoList;
// 	} catch (e) {
// 		console.error("Помилка додавання документа: ", e);
// 		throw e;
// 	}
// });

interface CreateListParams {
	name: string;
	ownerId: string;
}

export const createListAndRedirect = createAsyncThunk<
	TodoList,
	{ params: CreateListParams; navigate: NavigateFunction }
>("todos/createListAndRedirect", async ({ params, navigate }) => {
	try {
		const newTodo = {
			name: params.name,
			ownerId: params.ownerId,
			createdAt: new Date().toISOString(),
		};

		const docRef = await addDoc(collection(db, "lists"), newTodo);
		const createdTodo = {
			...newTodo,
			id: docRef.id,
		};

		navigate(`/todo/${docRef.id}`);
		return createdTodo as TodoList;
	} catch (error) {
		console.error("Ошибка при создании списка:", error);
		throw error;
	}
});

export const deleteListWithTasks = createAsyncThunk(
	"todos/deleteListWithTasks",
	async (listId: string) => {
		try {
			const tasksQuery = query(
				collection(db, "tasks"),
				where("listId", "==", listId)
			);
			const querySnapshot = await getDocs(tasksQuery);
			const deletePromises = querySnapshot.docs.map((doc) =>
				deleteDoc(doc.ref)
			);
			await Promise.all(deletePromises);
			await deleteDoc(doc(db, "lists", listId));
			return listId;
		} catch (error) {
			console.error("Помилка видалення документа: ", error);
			throw error;
		}
	}
);

interface ShareTodolistParams {
	listId: string;
	targetUserId: string;
}

export const addSharedUserToTodolist = createAsyncThunk<
	void,
	ShareTodolistParams,
	{ rejectValue: string }
>(
	"todos/addSharedUser",
	async ({ listId, targetUserId }, { rejectWithValue }) => {
		try {
			const todolistRef = doc(db, "lists", listId);
			const todolistSnap = await getDoc(todolistRef);

			if (!todolistSnap.exists()) {
				return rejectWithValue("Список не найден");
			}

			await updateDoc(todolistRef, {
				sharedWith: arrayUnion(targetUserId),
			});
		} catch (error) {
			console.error("Помилка додавання користувача до списку: ", error);
			throw error;
		}
	}
);

export const removeSharedUserFromTodolist = createAsyncThunk<
	void,
	ShareTodolistParams,
	{ rejectValue: string }
>(
	"todos/removeSharedUser",
	async ({ listId, targetUserId }, { rejectWithValue }) => {
		try {
			const todolistRef = doc(db, "lists", listId);
			const todolistSnap = await getDoc(todolistRef);

			if (!todolistSnap.exists()) {
				return rejectWithValue("Список не найден");
			}

			const currentData = todolistSnap.data();
			const updatedSharedUsers = (
				currentData.sharedWithUserIds || []
			).filter((id: string) => id !== targetUserId);

			await updateDoc(todolistRef, {
				sharedWithUserIds: updatedSharedUsers,
			});
		} catch (error) {
			console.error("Ошибка удаления пользователя из списка: ", error);
			throw error;
		}
	}
);
