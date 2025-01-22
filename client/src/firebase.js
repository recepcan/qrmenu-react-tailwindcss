// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "qr-menu-react.firebaseapp.com",
  projectId: "qr-menu-react",
  storageBucket: "qr-menu-react.firebasestorage.app",
  messagingSenderId: "1079016388092",
  appId: "1:1079016388092:web:5001ca9cae6f78dca82e79"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);