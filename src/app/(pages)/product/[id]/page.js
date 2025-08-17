"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/utils/firebase";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/containers/public/Navbar";
import {
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const [myListings, setMyListings] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [swapRequests, setSwapRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [hasAcceptedRequest, setHasAcceptedRequest] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docSnap = await getDoc(doc(db, "listings", id));
        if (docSnap.exists()) {
          setProduct({ id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user || !product || user.uid !== product.user_id) return;

      const requestsRef = collection(db, "listings", product.id, "swapRequests");
      const snap = await getDocs(requestsRef);
      const reqs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSwapRequests(reqs);

      const anyAccepted = reqs.some(r => r.status === "accepted");
      setHasAcceptedRequest(anyAccepted);
    };

    fetchRequests();
  }, [user, product]);

  // Fetch current user's listings
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;
      const listingsSnap = await getDocs(collection(db, "listings"));
      const userListings = listingsSnap.docs
        .filter(doc => doc.data().user_id === user.uid)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setMyListings(userListings);
    };

    fetchUserListings();
  }, [user]);

  const handleDelete = async () => {
    await deleteDoc(doc(db, "listings", id));
    toast.success("Listing deleted");
    router.push("/explore");
  };

  // ✅ Moved up to fix scope issue
  const updateSwapRequestStatus = async (requestId, status) => {
    const requestRef = doc(db, "listings", product.id, "swapRequests", requestId);
    try {
      await updateDoc(requestRef, { status });

      setSwapRequests(prev =>
        prev.map(r => (r.id === requestId ? { ...r, status } : r))
      );

      if (status === "accepted") {
        setHasAcceptedRequest(true);
        toast.success("Swap accepted! The requester will be notified.");
      } else if (status === "rejected") {
        toast("You rejected the swap request.", {
          icon: "❌",
        });
      }
    } catch (err) {
      toast.error("Failed to update request");
      console.error(err);
    }
  };

  const sendSwapRequest = async () => {
    if (!user || !product || !selectedOfferId) {
      toast.error("Please select one of your items to offer.");
      return;
    }

    try {
      const requestsCol = collection(db, "listings", product.id, "swapRequests");

      await addDoc(requestsCol, {
        fromUid: user.uid,
        fromName: user.displayName || "",
        fromEmail: user.email || "",
        offeredListing: selectedOfferId,
        message: message.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Swap request sent!");
      setProduct(prev => ({
        ...prev,
        requestedBy: [...(prev.requestedBy || []), user.uid],
      }));
    } catch (err) {
      console.error("Swap request error:", err);
      toast.error("Failed to send swap request");
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (!product) return <p className="text-center mt-10 text-red-500">Product not found.</p>;

  return (
    <>
      <Navbar />
      <div className="bg-maroon-50 min-h-screen py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2 gap-8 p-8">
          <Image
            src={product.imageURL || "/noImage.svg"}
            alt={`Image of ${product.title}`}
            width={500}
            height={500}
            className="rounded-xl border border-black object-cover w-full max-h-[500px]"
          />

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-maroon-900">{product.title}</h1>
              <p className="mt-2 text-gray-700 text-lg">{product.description}</p>

              <ul className="mt-4 text-sm text-gray-600 space-y-1">
                <li><strong>Category:</strong> {product.category}</li>
                <li><strong>Condition:</strong> {product.condition}</li>
                <li><strong>Meeting Spot:</strong> {product.meetingSpot}</li>
              </ul>
            </div>

            {user?.uid === product.user_id ? (
              <div className="flex flex-wrap gap-4 mt-6">
                <Link
                  href={`/product/edit/${id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Edit Listing
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Delete Listing
                </button>

                {swapRequests.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Swap Requests:</h2>
                    {swapRequests.map(req => (
                      <div key={req.id} className="border p-4 rounded-lg mb-4 bg-gray-50">
                        <p><strong>From:</strong> {req.fromUid}</p>
                        <p><strong>Offering:</strong> {req.offeredListing}</p>
                        <p><strong>Status:</strong> {req.status}</p>
                        {req.message && <p><strong>Message:</strong> {req.message}</p>}

                        {req.status === "pending" && (
                          <div className="flex gap-4 mt-2">
                            <button
                              onClick={() => updateSwapRequestStatus(req.id, "accepted")}
                              className="bg-green-600 text-white px-4 py-1 rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateSwapRequestStatus(req.id, "rejected")}
                              className="bg-red-600 text-white px-4 py-1 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose one of your listings to offer:
                  </label>
                  <select
                    value={selectedOfferId}
                    onChange={(e) => setSelectedOfferId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select your listing</option>
                    {myListings.map(listing => (
                      <option key={listing.id} value={listing.id}>
                        {listing.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add a message to the listing owner (optional):
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi! I’d love to trade. Let me know what works for you via email!"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <button
                  disabled={
                    hasAcceptedRequest || product?.requestedBy?.includes(user?.uid)
                  }
                  onClick={sendSwapRequest}
                  className={`mt-4 px-4 py-2 rounded-lg w-full transition ${
                    hasAcceptedRequest || product?.requestedBy?.includes(user?.uid)
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-maroon-900 hover:bg-maroon-700 text-white"
                  }`}
                >
                  {hasAcceptedRequest
                    ? "Swap Unavailable"
                    : product?.requestedBy?.includes(user?.uid)
                    ? "Swap Requested"
                    : "Request Swap"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
