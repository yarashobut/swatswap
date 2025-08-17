//this is for the sake of meeting checkpoint requirements only
import { db } from "@/utils/firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

// GET: Fetch all listings
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "listings"));
    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify(listings), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch listings" }), { status: 500 });
  }
}

// POST: Add a new listing
export async function POST(req) {
  try {
    const body = await req.json();
    const docRef = await addDoc(collection(db, "listings"), body);
    return new Response(JSON.stringify({ id: docRef.id }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to create listing" }), { status: 400 });
  }
}

