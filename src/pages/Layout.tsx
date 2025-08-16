import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { AuthCheck } from "../components/AuthCheck";
import "./Layout.css";

export const Layout = () => {
	return (
		<div className="layout-container">
			<AuthCheck />
			<div className="main-content">
				<Sidebar />
				<main className="page-content">
					<Outlet />
				</main>
			</div>
		</div>
	);
};
