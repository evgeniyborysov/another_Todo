import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import { useAppDispatch, useAppSelector } from "../store/store";
import { removeUser } from "../store/slices/userSlice";
import "./Sidebar.css";
import { useState, memo, useEffect } from "react";

import {
	createListAndRedirect,
	deleteListWithTasks,
	fetchTodoLists,
} from "../store/slices/todosThunks";

interface TodoListItem {
	id: string;
	name: string;
	ownerId: string;
	sharedWith?: string[];
}

const TodoList = memo(
	({
		lists,
		onDeleteList,
		isShared = false,
	}: {
		lists: TodoListItem[];
		onDeleteList: (id: string) => void;
		isShared?: boolean;
	}) => (
		<ul className="todos-list">
			{lists.map((list) => (
				<li key={list.id} className={isShared ? "shared-list" : ""}>
					<NavLink
						to={`/todo/${list.id}`}
						className={({ isActive }) =>
							`list-link ${isActive ? "active-list" : ""} ${
								isShared ? "shared" : ""
							}`
						}
						end
					>
						{list.name}
						{isShared && <span className="shared-icon">👥</span>}
					</NavLink>
					{!isShared && (
						<button
							onClick={() => onDeleteList(list.id)}
							className="delete-list-btn"
						>
							Delete
						</button>
					)}
				</li>
			))}
		</ul>
	)
);

export const Sidebar = () => {
	const [title, setTitle] = useState("");
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { user } = useAuth();
	const lists = useAppSelector((state) => state.todos.lists);

	useEffect(() => {
		if (user?.id) {
			dispatch(fetchTodoLists(user.id));
		}
	}, [dispatch, user?.id]);

	const handleSignOut = () => {
		try {
			dispatch(removeUser());
			navigate("/login");
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	console.log("Sidebar rendered with user:", user);

	// const handleSubmit = async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	if (!user?.id || !title.trim()) {
	// 		return;
	// 	}
	// 	const resultAction = await dispatch(
	// 		createList({ title: title, ownerId: user.id })
	// 	);
	// 	setTitle("");

	// 	if (createList.fulfilled.match(resultAction) && resultAction.payload) {
	// 		const newListId = resultAction.payload.id;
	// 		if (newListId) {
	// 			navigate(`/todo/${newListId}`);
	// 		} else {
	// 			console.error("Failed to create todo list");
	// 		}
	// 	}
	// };

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user?.id || !title.trim()) {
			return;
		}
		await dispatch(
			createListAndRedirect({
				params: { name: title.trim(), ownerId: user.id },
				navigate,
			})
		);
		setTitle("");
	};

	const handleDeleteList = (listId: string) => {
		dispatch(deleteListWithTasks(listId));
	};

	return (
		<aside className="sidebar">
			<div className="user-profile">
				<p className="email">Email: {user?.email}</p>
				{user?.name && <p className="name">Name: {user.name}</p>}
				<button className="logout-button" onClick={handleSignOut}>
					Logout
				</button>
			</div>
			<hr />
			<form className="add-list-form" onSubmit={handleSubmit}>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					type="text"
					placeholder="New todolist"
				/>
				<button type="submit">Add</button>
			</form>
			{lists && Array.isArray(lists) && lists.length > 0 ? (
				<>
					<div className="lists-section">
						<h3>Мої списки</h3>
						<TodoList
							lists={lists.filter(
								(list) => list.ownerId === user?.id
							)}
							onDeleteList={handleDeleteList}
						/>
					</div>

					{lists.some((list) => list.ownerId !== user?.id) && (
						<div className="lists-section shared">
							<h3>Спільні списки</h3>
							<TodoList
								lists={lists.filter(
									(list) => list.ownerId !== user?.id
								)}
								onDeleteList={handleDeleteList}
								isShared={true}
							/>
						</div>
					)}
				</>
			) : (
				<p className="no-todos">Ще немає списків</p>
			)}
		</aside>
	);
};
