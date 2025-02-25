import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBLmYxQqXf40uJ2Iji08pjGrzxP5Ex095w",
	authDomain: "ai-notion-clone-7e605.firebaseapp.com",
	projectId: "ai-notion-clone-7e605",
	storageBucket: "ai-notion-clone-7e605.firebasestorage.app",
	messagingSenderId: "1046326348706",
	appId: "1:1046326348706:web:343b29628b9bc49f8640fb",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
