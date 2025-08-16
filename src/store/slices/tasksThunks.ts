import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import type { NewTask, Task } from "./tasksSlice";

export const createTask = createAsyncThunk(
	"tasks/createTask",
	async (newTask: NewTask) => {
		try {
			const docRef = await addDoc(collection(db, "tasks"), newTask);
			console.log("Документ додано з ID: ", docRef.id);
			return {
				...newTask,
				id: docRef.id,
			} as Task;
		} catch (e) {
			console.error("Помилка додавання документа: ", e);
			throw e;
		}
	}
);

export const fetchTasks = createAsyncThunk(
	"tasks/fetchTasks",
	async (listId: string) => {
		try {
			const q = query(
				collection(db, "tasks"),
				where("listId", "==", listId)
			);
			const querySnapshot = await getDocs(q);
			const tasks = querySnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			})) as Task[];
			console.log("Отримані документи: ", tasks);
			return tasks;
		} catch (e) {
			console.error("Помилка отримання документів: ", e);
			throw e;
		}
	}
);

export const deleteTask = createAsyncThunk(
	"tasks/deleteTask",
	async (taskId: string) => {
		try {
			await deleteDoc(doc(db, "tasks", taskId));
			return taskId;
		} catch (error) {
			console.error("Помилка видалення документа: ", error);
			throw error;
		}
	}
);

export const updateTask = createAsyncThunk(
	"tasks/updateTask",
	async (task: Task) => {
		try {
			const { id, ...updateData } = task;
			const taskRef = doc(db, "tasks", id);
			await updateDoc(taskRef, updateData);
			return task.id;
		} catch (error) {
			console.error("Error updating task: ", error);
			throw error;
		}
	}
);
