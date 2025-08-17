"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth, db, storage } from "@/utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "@/containers/public/Navbar";
import toast from "react-hot-toast";


const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [preview, setPreview] = useState(null);


  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
  
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const profile = { id: user.uid, ...snap.data() };
        setUserData(profile);
        localStorage.setItem("userProfile", JSON.stringify(profile));
      }
    };
  
    fetchProfile();
  }, []);
  


//   const handleFileChange = (e) => {
//     setNewAvatar(e.target.files[0]);
//   };

  const handleFileChange = (e) => {
	const file = e.target.files[0];
	if (file) {
	  setNewAvatar(file);
	  setPreview(URL.createObjectURL(file)); 
	}
  };
  

  const handleProfileUpdate = async () => {
    if (!userData) return;
  
    let avatarURL = userData.avatar || "";
  
    try {
      // Upload avatar if changed
      if (newAvatar) {
        const fileRef = ref(storage, `avatars/${userData.id}`);
        await uploadBytes(fileRef, newAvatar);
        avatarURL = await getDownloadURL(fileRef);
      }
  
      // Prepare updated profile
      const updatedProfile = {
        name: userData.name || "",
        bio: userData.bio || "",
        avatar: avatarURL,
      };
  
      // Update Firestore
      const userRef = doc(db, "users", userData.id);
      await updateDoc(userRef, updatedProfile);
  
      // Sync state and localStorage
      const fullUserData = { id: userData.id, ...updatedProfile };
      setUserData(fullUserData);
      localStorage.setItem("userProfile", JSON.stringify(fullUserData));
  
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile");
    }
  };
  
  


  const onChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };  

  if (!userData) { //LETS MAKE THIS FUN!
	return (
	  <div className="min-h-screen flex flex-col items-center justify-center bg-maroon-50 text-maroon-900">
		<Image
		  src="/logo.png"
		  alt="SwatSwap logo"
		  width={100}
		  height={100}
		  className="animate-bounce mb-6"
		/>
		<h2 className="text-2xl font-semibold">Loading your profile...</h2>
		<p className="text-sm mt-2 text-gray-600">Please wait while we fetch your details from the cloud!</p>
		<div className="mt-6 w-16 h-16 border-4 border-maroon-900 border-t-transparent rounded-full animate-spin"></div>
	  </div>
	);
  }
  

  return (
    <>
      <Navbar />
      <div className="bg-maroon-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="flex flex-col items-center">
		  <Image
			key={userData.avatar} // ← force re-render when avatar updates
			src={preview || userData.avatar || "/defaultProfile.svg"}
			alt="User Avatar"
			width={120}
			height={120}
			className="rounded-full object-cover w-[120px] h-[120px] border-4 border-maroon-900 shadow-md"
			/>

            <input type="file" onChange={handleFileChange} className="mt-2" />
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={onChange}
              className="mt-4 text-2xl font-bold text-center text-gray-900"
            />
            <textarea
              name="bio"
              value={userData.bio}
              onChange={onChange}
              className="text-center mt-2 p-2 w-full max-w-sm text-gray-700"
              placeholder="Add a bio"
            />
            <button
              onClick={handleProfileUpdate}
              className="mt-3 bg-maroon-900 hover:bg-maroon-700 text-white px-4 py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 mt-10">
            <Link
              href="/swap-requests"
              className="text-center p-6 bg-maroon-900 text-white rounded-xl shadow hover:bg-maroon-600 flex items-center justify-center text-lg font-semibold">
              View Swap Requests
            </Link>
            <Link
              href="/favorites"
              className="text-center p-6 bg-maroon-900 text-white rounded-xl shadow hover:bg-maroon-600 flex items-center justify-center text-lg font-semibold">
              Favorited Listings
            </Link>
            <Link
              href="/swap-history"
              className="text-center p-6 bg-maroon-900 text-white rounded-xl shadow hover:bg-maroon-600 flex items-center justify-center text-lg font-semibold">
              Swap History
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
