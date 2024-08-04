// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estste-bd1ac.firebaseapp.com",
  projectId: "mern-estste-bd1ac",
  storageBucket: "mern-estste-bd1ac.appspot.com",
  messagingSenderId: "1024159494395",
  appId: "1:1024159494395:web:1240333673c2e9d5b0c05e"
};

// Initialize Firebase
export  const app = initializeApp(firebaseConfig);