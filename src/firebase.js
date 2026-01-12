import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqcg9mJW2_gVfxOXarAwmjXm8tk-SEjBg",
  authDomain: "smart-yatra-288f2.firebaseapp.com",
  projectId: "smart-yatra-288f2",
  storageBucket: "smart-yatra-288f2.firebasestorage.app",
  messagingSenderId: "574742651556",
  appId: "1:574742651556:web:65f09a3b73b9ab89603c31",
  measurementId: "G-4BSKGP3REN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);