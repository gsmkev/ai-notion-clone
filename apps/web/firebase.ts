import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCjvFsaSG4s2JQJzfSZJ8TDGn3neqqh6AE",
	authDomain: "ai-notion-clone-6d890.firebaseapp.com",
	projectId: "ai-notion-clone-6d890",
	storageBucket: "ai-notion-clone-6d890.firebasestorage.app",
	messagingSenderId: "243901691331",
	appId: "1:243901691331:web:2915bb0c5dea619139f976",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export { db };