import { auth, db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";


// Add new user to Firestore
export const addUser = async ({ uid, name, email, bio = "" }) => {
  try {
    await setDoc(doc(db, "users", uid), {
      id: uid,
      name,
      email,
      bio,
      favorites: []
    });
    console.log("User added to Firestore");
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Get a user by ID
export const getUserById = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

// Add a new listing
export const addListing = async (listing) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not logged in");

    const userDocRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userDocRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    const listingWithUser = {
      ...listing,
      user_id: currentUser.uid,
      user: {
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        avatar: "/defaultProfile.svg",  
      },
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "listings"), listingWithUser);
    console.log("Listing added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding listing:", error);
    return null;
  }
};

// Get all listings
export const getAllListings = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "listings"));
    const listings = [];
    querySnapshot.forEach((doc) => {
      listings.push({ id: doc.id, ...doc.data() });
    });
    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
};

// Get listings by user ID
export const getListingsByUserId = async (userId) => {
  try {
    const q = query(collection(db, "listings"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    const listings = [];
    querySnapshot.forEach((doc) => {
      listings.push({ id: doc.id, ...doc.data() });
    });
    return listings;
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return [];
  }
};

// utils/firestoreUtils.js

export async function getProductById(id) {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log('No such product!');
    return null;
  }
}
