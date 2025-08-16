import type { Task } from "../store/slices/tasksSlice";
import { deleteTask, updateTask } from "../store/slices/tasksThunks";
import { useAppDispatch } from "../store/store";
import "./TaskItem.css";

interface TaskItemProps {
	task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
	const dispatch = useAppDispatch();

	const handleToggleComplete = () => {
		const updatedCompleted = { ...task, completed: !task.completed };
		dispatch(updateTask(updatedCompleted));
	};

	return (
		<div className={`task-item ${task.completed ? "completed" : ""}`}>
			<input
				type="checkbox"
				name={task.id}
				id={task.id}
				checked={task.completed}
				aria-label={task.text}
				onChange={handleToggleComplete}
			/>
			<span className="task-text">{task.text}</span>
			{task.createdAt && (
				<span className="task-date">
					{new Date(task.createdAt).toLocaleDateString()}
				</span>
			)}
			<button
				className="delete-button"
				onClick={() => {
					console.log("Deleting task:", task.id);
					dispatch(deleteTask(task.id));
				}}
				aria-label={`Видалити задачу "${task.text}"`}
			>
				Видалити
			</button>
		</div>
	);
};
