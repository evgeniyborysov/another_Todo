import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "../store/store";
import { setUser, removeUser } from "../store/slices/userSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const AuthCheck = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				// Користувач авторизований
				try {
					const userDoc = await getDoc(doc(db, "users", user.uid));
					const userData = userDoc.data();

					dispatch(
						setUser({
							id: user.uid,
							email: user.email,
							token: await user.getIdToken(),
							name: userData?.name || null,
						})
					);
				} catch (error) {
					console.error("Error fetching user data:", error);
					dispatch(removeUser());
					navigate("/login");
				}
			} else {
				// Користувач не авторизований
				dispatch(removeUser());
				navigate("/login");
			}
		});

		// Відписуємося при розмонтуванні
		return () => unsubscribe();
	}, [dispatch, navigate]);

	return null;
};
