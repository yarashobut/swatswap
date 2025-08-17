import { db } from "@/utils/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  
//NOTIMPLEMENTED YET
  try {
    const listingRef = doc(db, "listings", id);
    await updateDoc(listingRef, body);
    return new Response(JSON.stringify({ message: "Listing updated" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to update listing" }), { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await deleteDoc(doc(db, "listings", id));
    return new Response(JSON.stringify({ message: "Listing deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to delete listing" }), { status: 400 });
  }
}
