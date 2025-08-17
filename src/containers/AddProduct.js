"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { db, auth } from "@/utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/utils/firebase";  

// toast for notifications : future implementation!!
import toast, { Toaster } from "react-hot-toast";

const defaultCredentials = {
	title: "",
	description: "",
	condition: "fair",
	category: "",
	giveAway: false,
	meetingSpot: "",
};

const handleFileChange = (event) => {
	const file = event.target.files?.[0]; // chaining to be safe
	if (!file) {
	  console.error("No file selected or invalid file");
	  return;
	}
  
	setPostFile(file);
	setImageURL(URL.createObjectURL(file));
  };
  

const AddProduct = () => {
	const router = useRouter(); // redirects after form submission

	// states
	const [credentials, setCredentials] = useState(defaultCredentials); // stores product info
	const [postFile, setPostFile] = useState(null); 
	const [imageURL, setImageURL] = useState("/uploadFile.svg"); // Local preview of image
	const [formStatus, setFormStatus] = useState(""); // form error status

	//text input changes
	const onChange = (event) => {
		setCredentials({
			...credentials,
			[event.target.name]: event.target.value,
		});
	};
	
	// file upload
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setPostFile(file);
		setImageURL(URL.createObjectURL(file)); // Create temporary preview URL
	};

	// submission logic
	const handleSubmit = async (event) => {
		event.preventDefault();
		const toastId = toast.loading("Saving product...");
	
		try {
			// Ensure user is logged in
			const user = auth.currentUser;
			if (!user) {
				toast.error("User not logged in", { id: toastId });
				return;
			}
	
			let imageUrl = "";
	
			// Upload the image if a file is selected
			if (postFile) {
				const fileRef = ref(storage, `productImages/${postFile.name}`);
				await uploadBytes(fileRef, postFile); 
				imageUrl = await getDownloadURL(fileRef);
			}
			
	
			// Construct listing object
			const newProduct = {
				...credentials,
				imageURL: imageUrl,
				user_id: user.uid,
				requestedBy: [],
				date: new Date().toISOString().split("T")[0],
				time: new Date().toLocaleTimeString(),
				createdAt: serverTimestamp(),
			};
	
			// Save listing to Firestore
			await addDoc(collection(db, "listings"), newProduct);
	
			toast.success("Product added!", { id: toastId });
	
			// Reset form
			setCredentials(defaultCredentials);
			setPostFile(null);
			setImageURL("/uploadFile.svg");
			router.push("/explore");
	
		} catch (error) {
			console.error("Error adding product:", error);
			toast.error("Error saving product", { id: toastId });
		}
	};
	
	//cancel button
	const cancelForm = () => {
		setCredentials(defaultCredentials); // reset form
		router.push("/explore"); // redirect
	};

	return (
		<>
			<Toaster /> {/* Notification toaster : WILL IMPLEMENT MORE LOGIC LATER*/}
			<div className="flex items-center justify-center">
				<div className="container max-w-screen-lg mx-auto pb-12 sm:pb-0">
					<div>
						<form onSubmit={handleSubmit}>
							<div className="bg-white rounded shadow-lg p-4 px-4 sm:p-8 mb-6">
								{/* FORM HEADER / IMAGE UPLOAD */}
								<div className="grid gap-4 gap-y-2 text-sm grid-cols-1 sm:grid-cols-3">
									<div className="text-gray-600">
										<p className="font-medium text-lg">Create Post</p>
										<p>Please fill out all the fields.</p>
										
										{/* Image Preview */}
										<Image
											src={imageURL}
											width={100}
											height={100}
											alt="Product Image"
											className="w-52 h-52 mt-10 mb-7 object-cover"
										/>

										{/* file upload input */}
										<label>Upload product image</label>
										<input
											type="file"
											name="image"
											accept="image/png, image/jpg, image/jpeg, image/svg"
											className="mt-3 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
											onChange={handleFileChange}
											required
										/>
									</div>

									{/* TEXT FIELDS */}
									<div className="sm:col-span-2">
										{formStatus && (
											<p className="text-red-500">{formStatus}</p>
										)}

										<div className="grid gap-4 gap-y-2 text-sm grid-cols-1 sm:grid-cols-5">

											{/* title */}
											<div className="sm:col-span-2">
												<label className="text-sm text-gray-600 font-bold">Title</label>
												<input
													type="text"
													name="title"
													value={credentials.title}
													placeholder="Enter product title"
													onChange={onChange}
													maxLength={20}
													required
													className="w-full mt-2 px-3 py-2 border-2 border-[darkgrey] focus:border-indigo-600 shadow-sm rounded-lg"
												/>
											</div>

											{/* category */}
											<div className="sm:col-span-3">
												<label className="text-sm text-gray-600 font-bold">Category</label>
												<input
													type="text"
													name="category"
													value={credentials.category}
													placeholder="Enter product category"
													onChange={onChange}
													maxLength={30}
													required
													className="w-full mt-2 px-3 py-2 border-2 border-[darkgrey] focus:border-indigo-600 shadow-sm rounded-lg"
												/>
											</div>

											{/* Description */}
											<div className="sm:col-span-5">
												<label className="text-sm text-gray-600 font-bold">Description</label>
												<textarea
													rows={2}
													name="description"
													value={credentials.description}
													placeholder="Enter product description"
													onChange={onChange}
													maxLength={500}
													required
													className="w-full mt-2 px-3 py-2 border-2 border-[darkgrey] focus:border-indigo-600 shadow-sm rounded-lg"
												/>
											</div>

											{/* Condition Dropdown */}
											<div className="sm:col-span-1">
												<label className="text-sm text-gray-600 font-bold">Condition</label>
												<select
													name="condition"
													onChange={onChange}
													defaultValue={credentials.condition}
													className="w-full mt-2 px-3 py-2 border-2 border-[darkgrey] focus:border-indigo-600 shadow-sm rounded-lg"
												>
													<option value="new">New</option>
													<option value="fair">Fair</option>
													<option value="good">Good</option>
													<option value="poor">Poor</option>
												</select>
											</div>

											{/* Meeting Spot */}
											<div className="sm:col-span-3">
												<label className="text-sm text-gray-600 font-bold">Meeting Spot</label>
												<textarea
													rows={1}
													name="meetingSpot"
													value={credentials.meetingSpot}
													placeholder="Enter meeting spot"
													onChange={onChange}
													maxLength={150}
													required
													className="w-full mt-2 px-3 py-2 border-2 border-[darkgrey] focus:border-indigo-600 shadow-sm rounded-lg"
												/>
											</div>

											{/* Give Away Toggle */}
											<div className="sm:col-span-5 flex gap-2 w-fit h-fit">
												<label className="relative flex cursor-pointer p-1 rounded-md">
													<input
														type="checkbox"
														name="giveAway"
														checked={credentials.giveAway}
														onChange={() =>
															setCredentials((prev) => ({
																...prev,
																giveAway: !prev.giveAway,
															}))
														}
														className="peer appearance-none h-5 w-5 border border-gray-600 checked:border-indigo-600 rounded-md"
													/>
													{/* Checkbox Check Icon */}
													<div className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-indigo-600 opacity-0 peer-checked:opacity-100">
														<svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
															<path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z" />
														</svg>
													</div>
												</label>
												<label className="my-auto text-sm text-gray-600">
													Give away for free
												</label>
											</div>
										</div>

										{/* Submit + Cancel Buttons */}
										<button
											type="submit"
											className="mt-2 mr-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 flex items-center gap-2 rounded-full"
										>
											<Image src="/checked.png" width={16} height={16} alt="Checked icon" />
											Post
										</button>
										<button
											type="button"
											onClick={cancelForm}
											className="mt-2 bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-full"
										>
											Cancel Changes
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddProduct;
