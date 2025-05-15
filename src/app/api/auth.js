// auth.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";

import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBErgTo1SWWEZpJBIkUdkjqtOtfnt6U1XM",
  authDomain: "deekshith-gowda.firebaseapp.com",
  projectId: "deekshith-gowda",
  storageBucket: "deekshith-gowda.firebasestorage.app",
  messagingSenderId: "630741971021",
  appId: "1:630741971021:web:a17517fb00e6667c662c04",
  measurementId: "G-4YD0NKX7K1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Sign Up with Email and Password
export const signUpUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        window.localStorage.setItem("useruid", user.uid);
        window.localStorage.setItem("isLoggedIn", true);
const userDoc = await getDoc(doc(db, "users", user.uid));
if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "",
            email: user.email,
            cart: [],
            orders: [],
            address: [],
            phone: "",
            createdAt: new Date(),
        });}

        console.log("User registered and document created!");
        return user;
    } catch (error) {
        console.error("Signup error:", error.message);
    }
};

// Sign In with Email and Password
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        window.localStorage.setItem("useruid", user.uid);
        window.localStorage.setItem("isLoggedIn", true);
        return userCredential.user;
    } catch (error) {
        console.error("Login error:", error.message);
    }
};

// Sign Out
export const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("User signed out");
    } catch (error) {
        console.error("Logout error:", error.message);
        throw error;
    }
};

// Google Sign-In
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        window.localStorage.setItem("useruid", user.uid);
        window.localStorage.setItem("email", user.email);

        // Check if Firestore user document exists
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, "users", user.uid), {
                name: user.displayName || "",
                email: user.email,
                cart: [],
                orders: [],
                address: [],
                phone: "",
                createdAt: new Date(),
            });
            console.log("Firestore user document created for Google user.");
        }

        console.log("Google sign-in successful");
        return user;
    } catch (error) {
        console.error("Google sign-in error:", error.message);
        throw error;
    }
};

export { auth, db };
