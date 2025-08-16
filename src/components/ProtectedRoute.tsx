import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export const ProtectedRoute = () => {
	const { user } = useAuth();
	const location = useLocation();

	if (!user?.id) {
		// Зберігаємо URL, з якого користувач прийшов
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <Outlet />;
};
