import { useUserInfo } from "../hooks/useUserInfo";

interface SharedUserItemProps {
	userId: string;
	onRemove: (userId: string) => void;
}

export const SharedUserItem = ({ userId, onRemove }: SharedUserItemProps) => {
	const { userData, loading, error } = useUserInfo(userId);

	if (loading) {
		return <div className="shared-user-item loading">Завантаження...</div>;
	}

	if (error) {
		return <div className="shared-user-item error">{error}</div>;
	}

	return (
		<div className="shared-user-item">
			<div className="user-info">
				{userData?.name && (
					<span className="user-name">{userData.name}</span>
				)}
				<span className="user-email">{userData?.email}</span>
			</div>
			<button
				onClick={() => onRemove(userId)}
				className="remove-access-btn"
			>
				Відкликати доступ
			</button>
		</div>
	);
};
