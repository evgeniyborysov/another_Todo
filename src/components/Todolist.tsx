import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { useEffect, useState } from "react";
import { createTask, fetchTasks } from "../store/slices/tasksThunks";
import type { NewTask } from "../store/slices/tasksSlice";
import { TaskItem } from "./TaskItem";
import {
	addSharedUserToTodolist,
	removeSharedUserFromTodolist,
} from "../store/slices/todosThunks";
import { useAuth } from "../hooks/use-auth";
import { ShareTodolist } from "./ShareTodolist";
import { SharedUserItem } from "./SharedUserItem";
import "./Todolist.css";

export const Todolist = () => {
	const [title, setTitle] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const { id } = useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const todolist = useAppSelector((state) =>
		state.todos.lists.find((list) => list.id === id)
	);
	const tasks = useAppSelector((state) => state.tasks);

	console.log(`todolist`, todolist?.sharedWith);

	useEffect(() => {
		async function loadTasks() {
			if (id) {
				setIsLoading(true);
				try {
					await dispatch(fetchTasks(id));
				} finally {
					setIsLoading(false);
				}
			}
		}
		loadTasks();
	}, [id, dispatch]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (id) {
			const newTask: NewTask = {
				text: title,
				listId: id,
				completed: false,
				createdAt: new Date().toISOString(),
			};
			dispatch(createTask(newTask));
			setTitle("");
		}
	};

	const handleShare = (userId: string) => {
		if (!id) return;
		dispatch(
			addSharedUserToTodolist({
				listId: id,
				targetUserId: userId,
			})
		);
	};

	const handleRemoveSharedUser = async (userId: string) => {
		if (!todolist) return;
		try {
			await dispatch(
				removeSharedUserFromTodolist({
					listId: todolist.id,
					targetUserId: userId,
				})
			);
		} catch (error) {
			console.error("Ошибка при отзыве доступа:", error);
		}
	};

	if (!todolist) {
		return (
			<div>
				<h2>Список не знайдено</h2>
				<button onClick={() => navigate("/")}>
					Повернутися на головну
				</button>
			</div>
		);
	}

	// Перевірка, чи користувач є власником списку
	const isOwner = user?.id === todolist.ownerId;

	return (
		<div className="todolist">
			{todolist && (
				<div>
					<h2>{todolist.name}</h2>
					{isOwner && (
						<>
							<button onClick={() => setShowShareModal(true)}>
								Поділитися
							</button>
							{showShareModal && (
								<ShareTodolist
									onShare={handleShare}
									onClose={() => setShowShareModal(false)}
								/>
							)}
						</>
					)}

					<form onSubmit={handleSubmit}>
						<input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							type="text"
							placeholder="Add a task"
						/>
						<button type="submit">Add</button>
					</form>
					<ul>
						{isLoading ? (
							<p>Завантаження...</p>
						) : (
							<>
								{tasks &&
									tasks
										.filter((task) => task.listId === id)
										.map((task) => (
											<TaskItem
												key={task.id}
												task={task}
											/>
										))}
								{(!tasks ||
									tasks.filter((task) => task.listId === id)
										.length === 0) && <p>Немає задач</p>}
							</>
						)}
					</ul>
					{isOwner && (
						<div className="shared-users-list">
							<h4>Користувачі з доступом:</h4>
							{todolist.sharedWith?.length > 0 ? (
								todolist.sharedWith.map((userId: string) => (
									<SharedUserItem
										key={userId}
										userId={userId}
										onRemove={handleRemoveSharedUser}
									/>
								))
							) : (
								<p className="no-shared-users">
									Цей список ще ні з ким не спільний
								</p>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
