import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

interface UserData {
	email: string;
	name: string | null;
}

export const useUserInfo = (userId: string) => {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userDoc = await getDoc(doc(db, "users", userId));
				if (userDoc.exists()) {
					const data = userDoc.data();
					setUserData({
						email: data.email,
						name: data.name,
					});
				} else {
					setError("Користувача не знайдено");
				}
			} catch (err) {
				setError("Помилка при отриманні даних користувача");
				console.error("Error fetching user data:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [userId]);

	return { userData, loading, error };
};
