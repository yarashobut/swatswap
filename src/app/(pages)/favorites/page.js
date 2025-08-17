"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/utils/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import Navbar from "@/containers/public/Navbar";
import Link from "next/link";
import Image from "next/image";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;

      const favIds = userSnap.data().favorites || [];

      // Fetch all listings (you could optimize this later)
      const listingsSnap = await getDocs(collection(db, "listings"));
      const listings = [];
      listingsSnap.forEach((doc) => {
        if (favIds.includes(doc.id)) {
          listings.push({ id: doc.id, ...doc.data() });
        }
      });

      setFavorites(listings);
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading favorites...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Favorited Listings</h1>

        {favorites.length === 0 ? (
          <p>You haven’t favorited anything yet!</p>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
            {favorites.map((item) => (
              <Link key={item.id} href="#">
                <div className="border rounded-xl p-4 shadow hover:scale-105 transition">
                  <Image
                    src={item.imageURL || "/placeholder.png"}
                    alt={item.title}
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                  />
                  <p className="font-semibold mt-2">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FavoritesPage;
