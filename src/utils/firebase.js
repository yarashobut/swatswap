import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// https://firebase.google.com/docs/web/setup#available-libraries


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk5siIzNE7DDvZ6j7U1BOYGAJ7X8UuFYA",
  authDomain: "swatswap-3dd41.firebaseapp.com",
  projectId: "swatswap-3dd41",
  storageBucket: "swatswap-3dd41.firebasestorage.app",
  messagingSenderId: "828741880334",
  appId: "1:828741880334:web:ed8ac39662e9106f980a5f",
  measurementId: "G-Y36F7YVE9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Automatically add user to Firestore on login
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        name: user.displayName || "",
        email: user.email,
        bio: "",
        favorites: [],
      });
      console.log("User added to Firestore");
    }
  }
});