// lib/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Realtime Database
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { getAnalytics } from "firebase/analytics"; // Firebase Analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz1ASjJi7srmnonk0uf8ETrSPL1MlTuwE",
  authDomain: "management-system-2504f.firebaseapp.com",
  projectId: "management-system-2504f",
  databaseURL: "https://management-system-2504f-default-rtdb.firebaseio.com", // Realtime Database URL
  storageBucket: "management-system-2504f.appspot.com",
  messagingSenderId: "867025716009",
  appId: "1:867025716009:web:60852411470c66e8f2ed38",
  measurementId: "G-N7JC0YBNBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // Initialize analytics only if in browser
const database = getDatabase(app); // Initialize Realtime Database
const auth = getAuth(app); // Initialize Firebase Authentication

export { app, analytics, database, auth };
