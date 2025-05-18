import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAfN1nB6n6I-9rYS5CqRk1HoLRwfy7Mr_o",
  authDomain: "gastrolink-77627.firebaseapp.com",
  projectId: "gastrolink-77627",
  storageBucket: "gastrolink-77627.appspot.com",
  messagingSenderId: "355297546021",
  appId: "1:355297546021:web:ddd4b8e26128cb48eed4cc",
  measurementId: "G-9KPH2H38JM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
