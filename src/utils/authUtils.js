import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase"; 
import { addUser } from "./firestoreUtils";

export const setupUserListener = () => {
	onAuthStateChanged(auth, async (user) => {
		if (user) {
			await addUser({
				uid: user.uid,
				name: user.displayName || "Unnamed User",
				email: user.email,
				bio: "" // default / dummy val
			});
		}
	});
};
