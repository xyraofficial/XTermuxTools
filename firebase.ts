import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0TEu9fIQBja59n5vq9HKxn-aUkTHL1Ow",
  authDomain: "xyratermux.firebaseapp.com",
  databaseURL: "https://xyratermux-default-rtdb.firebaseio.com",
  projectId: "xyratermux",
  storageBucket: "xyratermux.firebasestorage.app",
  messagingSenderId: "1019621784884",
  appId: "1:1019621784884:web:4e5debe60deaaafcff3961",
  measurementId: "G-ZWQRLDM4M7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
