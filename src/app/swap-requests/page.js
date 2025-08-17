"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/utils/firebase";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import Navbar from "@/containers/public/Navbar";
import toast from "react-hot-toast";

const SwapRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const pendingRequests = requests.filter(req => req.status === "pending");
  const user = auth.currentUser;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;

      const allRequests = [];

      // 1. Get listings owned by this user
      const listingsSnap = await getDocs(collection(db, "listings"));
      const ownedListings = listingsSnap.docs.filter(doc => doc.data().user_id === user.uid);

      // 2. For each listing, check if it has swapRequests
      for (const listing of ownedListings) {
        const swapRequestsRef = collection(db, "listings", listing.id, "swapRequests");
        const swapsSnap = await getDocs(swapRequestsRef);
        swapsSnap.forEach(req => {
          allRequests.push({
            id: req.id,
            ...req.data(),
            listingId: listing.id,
            listingTitle: listing.data().title,
          });
        });
      }

      setRequests(allRequests);
      setLoading(false);
    };

    fetchRequests();
  }, [user]);

  const handleAcceptSwap = async (req) => {
    try {
      const listingRef = doc(db, "listings", req.listingId);
      const acceptedRequestRef = doc(db, "listings", req.listingId, "swapRequests", req.id);
  
      // Accept the selected one
      await updateDoc(acceptedRequestRef, { status: "accepted" });

      // Mark the listing as swapped so it doesn't show on Explore page
      await updateDoc(listingRef, { isSwapped: true });

      // Fetch and reject all other requests
      const swapsSnap = await getDocs(collection(db, "listings", req.listingId, "swapRequests"));
      const otherRequests = swapsSnap.docs.filter(d => d.id !== req.id);
  
      await Promise.all(
        otherRequests.map(r =>
          updateDoc(doc(db, "listings", req.listingId, "swapRequests", r.id), {
            status: "rejected",
          })
        )
      );
  
      // Update local state
      setRequests(prev =>
        prev.map(r =>
          r.listingId === req.listingId
            ? r.id === req.id
              ? { ...r, status: "accepted" }
              : { ...r, status: "rejected" }
            : r
        )
      );
  
      toast(
        (t) => (
          <div className="text-sm">
            <p className="font-semibold text-green-700">Swap accepted!</p>
            <p className="mt-1">
              Contact <span className="font-mono text-blue-600">{req.fromEmail}</span> to finalize the swap.
            </p>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="mt-2 text-xs underline text-gray-500 hover:text-gray-700"
            >
              Dismiss
            </button>
          </div>
        ),
        {
          duration: 8000,
          style: {
            border: "1px solid #22c55e",
            padding: "16px",
            color: "#065f46",
            background: "#ecfdf5",
          },
        }
      );
    } catch (err) {
      console.error("Failed to accept swap:", err);
      toast.error("Failed to accept swap.");
    }
  };
  
  
  
  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-maroon-900 mb-6">Swap Requests</h1>
  
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No swap requests on your listings yet.</p>
        ) : (
          <div className="grid gap-6 mt-6">
            {requests.map((req, index) => (
              <div
                key={req.id + index}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-maroon-900">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-maroon-900">
                    📦 Swap Request for <span className="italic">{req.listingTitle || "Unnamed Listing"}</span>
                  </h2>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full 
                      ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>

                <div className="text-gray-700 space-y-2 text-sm md:text-base">
                  <p>
                    <strong>👤 From:</strong> {req.fromName || "Anonymous"} ({req.fromEmail})
                  </p>
                  <p>
                    <strong>🎁 Offered Listing ID:</strong> <span className="font-mono">{req.offeredListing}</span>
                  </p>
                  {req.message && (
                    <p>
                      <strong>💬 Message:</strong> <span className="italic">{req.message}</span>
                    </p>
                  )}
                </div>

                {req.status === "pending" && (
                  <button
                    onClick={() => handleAcceptSwap(req)}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                    ✅ Accept Swap
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SwapRequestsPage;
