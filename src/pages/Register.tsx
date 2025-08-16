import { Link } from "react-router-dom";
import { Form } from "../components/Form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "../pages/Auth.css";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import { setUser } from "../store/slices/userSlice";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const Register = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleRegister = async (
		email: string,
		password: string,
		name?: string
	) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Зберігаємо в Firestore
			await setDoc(doc(db, "users", user.uid), {
				email,
				name: name || null,
				createdAt: new Date().toISOString(),
			});

			// Отримуємо з Firestore тільки-но створеного користувача
			const userDoc = await getDoc(doc(db, "users", user.uid));
			const userData = userDoc.data(); // ← Ось тут створюється userData

			dispatch(
				setUser({
					id: user.uid,
					email: user.email,
					token: user.refreshToken,
					name: userData?.name || null,
				})
			);

			navigate("/");
			console.log("User registered:", user);
		} catch (error) {
			console.error("Error registering user:", error);
			throw error;
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-form">
				<h2>Реєстрація</h2>
				<Form onSubmit={handleRegister} mode="register" />
				<div className="auth-footer">
					Вже є акаунт?
					<Link to="/login">Увійти</Link>
				</div>
			</div>
		</div>
	);
};
