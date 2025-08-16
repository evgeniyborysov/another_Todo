import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Todolist } from "./components/Todolist";
import { Layout } from "./pages/Layout";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const App = () => {
	return (
		<Routes>
			{/* Публічні маршрути */}
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />

			{/* Захищені маршрути */}
			<Route element={<ProtectedRoute />}>
				<Route element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="todo/:id" element={<Todolist />} />
				</Route>
			</Route>

			{/* Маршрут 404 */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};
