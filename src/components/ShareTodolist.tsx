import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import "./ShareTodolist.css";

interface ShareTodolistProps {
	onShare: (userId: string) => void;
	onClose: () => void;
}

export const ShareTodolist = ({ onShare, onClose }: ShareTodolistProps) => {
	const [email, setEmail] = useState("");
	const [searchResults, setSearchResults] = useState<
		{ id: string; email: string }[]
	>([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const searchUsers = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;

		setLoading(true);
		setError("");

		try {
			const usersRef = collection(db, "users");
			const q = query(usersRef, where("email", "==", email.trim()));
			const querySnapshot = await getDocs(q);

			const users = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				email: doc.data().email,
			}));

			setSearchResults(users);
			if (users.length === 0) {
				setError("Користувача не знайдено");
			}
		} catch (error) {
			console.error("Error searching users:", error);
			setError("Помилка при пошуку користувача");
		} finally {
			setLoading(false);
		}
	};

	const handleShare = (userId: string) => {
		onShare(userId);
		onClose();
	};

	return (
		<div className="share-modal">
			<div className="share-modal-content">
				<h3>Поділитися списком</h3>
				<form onSubmit={searchUsers} className="share-form">
					<div className="form-group">
						<label htmlFor="email">Email користувача</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Введіть email користувача"
						/>
					</div>
					<button type="submit" disabled={loading}>
						{loading ? "Пошук..." : "Знайти"}
					</button>
				</form>

				{error && <p className="error-message">{error}</p>}

				<div className="search-results">
					{searchResults.map((user) => (
						<div key={user.id} className="user-result">
							<span>{user.email}</span>
							<button
								onClick={() => handleShare(user.id)}
								className="share-button"
							>
								Поділитися
							</button>
						</div>
					))}
				</div>

				<button onClick={onClose} className="close-button">
					Закрити
				</button>
			</div>
		</div>
	);
};
