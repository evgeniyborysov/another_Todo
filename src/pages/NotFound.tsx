import { Link } from "react-router-dom";

export const NotFound = () => {
	return (
		<div className="not-found">
			<h1>404</h1>
			<h2>Сторінка не знайдена</h2>
			<p>Вибачте, запитувана сторінка не існує.</p>
			<Link to="/">Повернутися на головну</Link>
		</div>
	);
};
