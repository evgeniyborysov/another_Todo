import { useAppSelector } from "../store/store";
import { authService } from "../services/auth.service";

export const useAuth = () => {
	const { email, token, id, name } = useAppSelector((state) => state.user);

	// Перевіряємо, чи є користувач аутентифікованим
	const isAuth =
		Boolean(email && token && id) && authService.isAuthenticated();

	return {
		isAuth,
		user: isAuth ? { email, id, name: name || "" } : null,
	};
};
