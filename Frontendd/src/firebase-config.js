// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA94ne90x6WqCfbSD1mS1SKa72F0BH2Sb8",
  authDomain: "myfitengine-90195.firebaseapp.com",
  projectId: "myfitengine-90195",
  storageBucket: "myfitengine-90195.firebasestorage.app",
  messagingSenderId: "83450193531",
  appId: "1:83450193531:web:4fd2e07477927bccb5e4de",
  measurementId: "G-BHMVKGT78E"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
