"use client"; 

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Dropdown } from "antd";  
import { signOut } from "firebase/auth";


// Static path to default profile image in public folder
const defaultProfile = "/defaultProfile.svg";


const Navbar = () => {
	// State hooks!!
	const [userDetails, setUserDetails] = useState(null); // Holds user data (currently dummy users)
	const [isLoggedIn, setIsLoggedIn] = useState(true);   // conditionally render profile dropdown
	const [loading, setLoading] = useState(true);          

	// useEffect simulates fetching user info (mocked for now)
	useEffect(() => {
		const fetchUser = async () => {
		  const user = auth.currentUser;
		  if (!user) {
			setIsLoggedIn(false);
			setLoading(false);
			return;
		  }
	  
		  try {
			const userRef = doc(db, "users", user.uid);
			const snap = await getDoc(userRef);
			if (snap.exists()) {
			  setUserDetails(snap.data());
			  setIsLoggedIn(true);
			} else {
			  setIsLoggedIn(false);
			}
		  } catch (error) {
			console.error("Error fetching user:", error);
			setIsLoggedIn(false);
		  } finally {
			setLoading(false);
		  }
		};
	  
		fetchUser();
	  }, []);


	// in theory this handles logout request 
	const handleLogout = async () => {
		try {
		  await signOut(auth);
		  setIsLoggedIn(false);
		  window.location.href = "/login"; // or redirect however you want
		} catch (error) {
		  console.error("Logout failed:", error);
		}
	  };
	  

	// for dropdown menu items when user is logged in
	const items = [
		{
		  key: "1",
		  label: <Link href="/profile">View Profile</Link>,
		},
		{
		  key: "2",
		  label: <Link href="/explore">Explore</Link>,
		},
		{
		  key: "3",
		  label: (
			<button onClick={handleLogout} className="w-full text-left">
			  Logout
			</button>
		  ),
		},
	  ];
	  

	// render loading state  
	if (loading) {
		return (
			<div className="bg-maroon-900 text-white">
				<div className="mx-auto flex justify-between px-5 py-2 items-center">
					{/* Logo */}
					<Link href="/">
						<Image src="/logo.png" alt="logo" width={100} height={100} />
					</Link>
					{/* Loading structure for nav items */}
					<div className="gap-6 items-center hidden sm:flex">
						<div className="bg-neutral-400/50 w-20 h-4 animate-pulse rounded-md"></div>
						<div className="bg-neutral-400/50 w-20 h-4 animate-pulse rounded-md"></div>
						<div className="bg-neutral-400/50 w-10 h-10 animate-pulse rounded-full"></div>
					</div>
				</div>
			</div>
		);
	}

	// render actual navbar now 
	return (
		<>
			<div className="bg-maroon-900 text-white">
				<div className="mx-auto max-w-7xl flex justify-between px-5 py-2 items-center">
					
					{/* we want the logo to always visible */}
					<Link href="/">
						<Image
							src="/logo.png"
							alt="logo"
							width={100}
							height={100}
						/>
					</Link>

					{/* If user is "logged in", show dropdown menu */}
					{isLoggedIn && (
						<Dropdown
							placement="bottom"
							menu={{
								items: [
									{
										key: "1",
										label: <Link href="/profile">View Profile</Link>,
									},
									// Future items can go here:
									{
										key: "2",
										label: <Link href="/explore">Explore</Link>, 
									 },
									{
										key: "3",
										label: (
										  <button
											onClick={handleLogout}
											className="text-left w-full"
											style={{ background: "none", border: "none", padding: 0, margin: 0 }}
										  >
											Logout
										  </button>
										),
									  }
								],
							}}
						>
							<Image
								src={userDetails?.avatar || defaultProfile}
								alt="User Avatar"
								className="w-10 h-10 rounded-full object-cover cursor-pointer"
								width={40}
								height={40}
							/>
						</Dropdown>
					)}
				</div>
			</div>
		</>
	);
};

export default Navbar;
