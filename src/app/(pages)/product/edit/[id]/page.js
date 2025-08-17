"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth, storage } from "@/utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/containers/public/Navbar";
import Image from "next/image";

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const snap = await getDoc(doc(db, "listings", id));
        if (snap.exists()) {
          setProduct(snap.data());
          setImagePreview(snap.data().imageURL);
        } else {
          toast.error("Listing not found");
          router.push("/explore");
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setImagePreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating listing...");

    try {
      let imageURL = product.imageURL;

      if (file) {
        const fileRef = ref(storage, `productImages/${file.name}`);
        await uploadBytes(fileRef, file);
        imageURL = await getDownloadURL(fileRef);
      }

      await updateDoc(doc(db, "listings", id), {
        ...product,
        imageURL,
        updatedAt: serverTimestamp(),
      });

      toast.success("Listing updated", { id: toastId });
      router.push("/explore");
    } catch (err) {
      console.error(err);
      toast.error("Update failed", { id: toastId });
    }
  };

  if (loading || !product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="bg-maroon-50 min-h-screen py-10 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-maroon-900">Edit Your Listing</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <Image
                src={imagePreview || "/noImage.svg"}
                alt="Product preview"
                width={200}
                height={200}
                className="rounded-lg border border-gray-300 mt-2 object-cover w-full max-w-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block text-sm text-gray-600"
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={product.title}
                onChange={handleChange}
                required
                className="mt-1 px-3 py-2 border border-gray-300 rounded-lg w-full"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                className="mt-1 px-3 py-2 border border-gray-300 rounded-lg w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={3}
                required
                className="mt-1 px-3 py-2 border border-gray-300 rounded-lg w-full"
              />
            </div>

            {/* Meeting Spot */}
            <div>
              <label htmlFor="meetingSpot" className="block font-medium text-gray-700">
                Meeting Spot
              </label>
              <input
                type="text"
                id="meetingSpot"
                name="meetingSpot"
                value={product.meetingSpot}
                onChange={handleChange}
                required
                className="mt-1 px-3 py-2 border border-gray-300 rounded-lg w-full"
              />
            </div>

            {/* Condition dropdown */}
            <div>
              <label htmlFor="condition" className="block font-medium text-gray-700">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={product.condition}
                onChange={handleChange}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-lg w-full"
              >
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            {/* Giveaway toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="giveAway"
                name="giveAway"
                checked={product.giveAway}
                onChange={handleChange}
                className="h-4 w-4 text-maroon-900 focus:ring-maroon-700 border-gray-300 rounded"
              />
              <label htmlFor="giveAway" className="text-sm text-gray-700">
                Give away for free
              </label>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="bg-maroon-900 hover:bg-maroon-700 text-white px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => router.push("/explore")}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProductPage;
