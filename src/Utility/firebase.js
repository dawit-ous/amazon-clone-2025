// Import the necessary Firebase functions
import { initializeApp } from "firebase/app"; // Initialize Firebase app
import { getAuth } from "firebase/auth"; // Initialize Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Initialize Firestore

// Firebase configuration object
// Import the functions you need from the SDKs you need

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXTZIpV6UD3pBCLmDdg-OqjTl-31RNAMw",
  authDomain: "clone-9cd4b.firebaseapp.com",
  projectId: "clone-9cd4b",
  storageBucket: "clone-9cd4b.firebasestorage.app",
  messagingSenderId: "941329942474",
  appId: "1:941329942474:web:3318120de971cd9501f133",
  measurementId: "G-72T7SC5Y5R"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);

