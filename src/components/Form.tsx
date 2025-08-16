import { useState } from "react";

type FormMode = "login" | "register";

type FormProps = {
	mode: FormMode;
	onSubmit: (email: string, password: string, name?: string) => void;
};

export const Form = ({ onSubmit, mode }: FormProps) => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [name, setName] = useState<string>("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (mode === "login") {
			onSubmit(email, password);
		} else {
			onSubmit(email, password, name);
		}
	};

	return (
		<div className="auth-form">
			<form onSubmit={handleSubmit}>
				{mode === "register" && (
					<div className="form-group">
						<label htmlFor="name">Ім'я</label>
						<input
							id="name"
							type="text"
							placeholder="Введіть ваше ім'я"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
				)}
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						type="email"
						placeholder="Введіть ваш email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Пароль</label>
					<input
						id="password"
						type="password"
						placeholder="Введіть ваш пароль"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit">
					{mode === "login" ? "Увійти" : "Зареєструватися"}
				</button>
			</form>
		</div>
	);
};
