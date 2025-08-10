import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBXhvTHL0t-b-neShgxVTmP4jDiPYXOy0",
  authDomain: "dtronics-iot2.firebaseapp.com",
  projectId: "dtronics-iot2",
  storageBucket: "dtronics-iot2.firebasestorage.app",
  messagingSenderId: "1035147154678",
  appId: "1:1035147154678:web:48af337b11d7bdfed608d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Email/Password Auth functions
export const signUpWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export default app;
