import { Link } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import "./Home.css";

export const Home = () => {
	const { user } = useAuth();

	return (
		<div className="home-container">
			<h1>Ласкаво просимо{user?.email ? `, ${user.email}` : ""}!</h1>
			<p>Це головна сторінка вашого TODO додатку.</p>
			<p>Звідси ви можете:</p>
			<ul>
				<li>Переглядати існуючі списки справ (в сайдбарі)</li>
				<li>Створювати нові списки справ (форма в сайдбарі)</li>
				<li>Керувати своїми завданнями</li>
				<li>Ділитися списками з іншими користувачами</li>
			</ul>
			<div className="quick-start">
				<h3>Швидкий старт:</h3>
				<p>
					Немає жодного списку?{" "}
					<Link to="/todo/new">Створіть свій перший список!</Link>
				</p>
			</div>
			<p>
				Оберіть список у бічній панелі, щоб переглянути завдання, або
				створіть новий.
			</p>
		</div>
	);
};
