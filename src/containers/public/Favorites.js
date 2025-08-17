"use client";
import Navbar from "@/containers/public/Navbar";

const FavoritesComponent = () => {
	return (
		<>
			<Navbar />
			<div className="max-w-7xl mx-auto px-4 py-10">
				<h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
				<p className="text-gray-600">These are the listings you've liked.</p>

				{/* Placeholder content */}
				<div className="mt-8 border rounded-lg p-6 bg-gray-50 text-center">
					<p className="text-gray-500 italic">You haven’t added any favorites yet.</p>
				</div>
			</div>
		</>
	);
};

export default FavoritesComponent;
