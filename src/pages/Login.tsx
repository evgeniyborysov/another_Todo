import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form } from "../components/Form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { setUser } from "../store/slices/userSlice";
import { useAppDispatch } from "../store/store";
import { doc, getDoc } from "firebase/firestore";

export const Login = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useAppDispatch();

	// Отримуємо URL, з якого користувач прийшов
	const from = location.state?.from?.pathname || "/";
	const handleLogin = async (email: string, password: string) => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			console.log("User logged in:", user);

			try {
				// Получаем дополнительные данные пользователя из Firestore
				const userDoc = await getDoc(doc(db, "users", user.uid));
				const userData = userDoc.data();
				console.log("User data from Firestore:", userData);

				dispatch(
					setUser({
						id: user.uid,
						email: user.email,
						token: user.refreshToken,
						name: userData && userData.name ? userData.name : null,
					})
				);
			} catch (firestoreError) {
				console.error(
					"Error fetching user data from Firestore:",
					firestoreError
				);
				// В случае ошибки получения данных из Firestore, все равно авторизуем пользователя
				dispatch(
					setUser({
						id: user.uid,
						email: user.email,
						token: user.refreshToken,
						name: null,
					})
				);
			}

			navigate(from, { replace: true });
		} catch (error) {
			const firebaseError = error as { code: string; message: string };
			const errorCode = firebaseError.code;
			const errorMessage = firebaseError.message;
			console.error("Error logging in user:", errorCode, errorMessage);
			throw error; // Пробрасываем ошибку дальше для обработки в компоненте Form
		}
	};
	return (
		<div className="auth-container">
			<div className="auth-form">
				<h2>Вхід</h2>
				<Form onSubmit={handleLogin} mode="login" />
				<div className="auth-footer">
					Немає акаунту?
					<Link to="/register">Зареєструватися</Link>
				</div>
			</div>
		</div>
	);
};
