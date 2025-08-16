import Cookies from "js-cookie";

export interface AuthData {
	id: string;
	name: string;
	email: string | null;
	token: string;
}

const AUTH_COOKIE_NAME = "auth_token";
const COOKIE_EXPIRES = 7; // cookie will expire in 7 days

export const authService = {
	setAuth(data: AuthData) {
		Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(data), {
			expires: COOKIE_EXPIRES,
			secure: true,
			sameSite: "strict",
		});
	},

	getAuth(): AuthData | null {
		const auth = Cookies.get(AUTH_COOKIE_NAME);
		if (auth) {
			try {
				return JSON.parse(auth);
			} catch {
				return null;
			}
		}
		return null;
	},

	removeAuth() {
		Cookies.remove(AUTH_COOKIE_NAME);
	},

	isAuthenticated(): boolean {
		return !!this.getAuth();
	},
};
