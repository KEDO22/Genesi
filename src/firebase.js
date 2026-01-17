// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// La tua configurazione specifica
const firebaseConfig = {
  apiKey: "AIzaSyCW-aNijrzu_ayV3OUgPIrgwxZ8xKJpnn8",
  authDomain: "gen2-4855a.firebaseapp.com",
  projectId: "gen2-4855a",
  storageBucket: "gen2-4855a.firebasestorage.app",
  messagingSenderId: "274630926466",
  appId: "1:274630926466:web:b70adaa8db64ded4d7549b",
  measurementId: "G-XZ5NKDVZZW"
};

// Inizializza l'app
const app = initializeApp(firebaseConfig);

// Esportiamo Database e Auth per usarli nell'app
export const db = getFirestore(app);
export const auth = getAuth(app);
