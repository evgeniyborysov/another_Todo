import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyCfJkogtd2da5ZePPf0lb6YMQV5Kq8UsUg",
	authDomain: "my-todo-app-ead4b.firebaseapp.com",
	projectId: "my-todo-app-ead4b",
	storageBucket: "my-todo-app-ead4b.firebasestorage.app",
	messagingSenderId: "984285802037",
	appId: "1:984285802037:web:8b68181eaa9985c5ba8b7c",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
