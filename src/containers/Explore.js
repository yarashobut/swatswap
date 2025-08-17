
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Image from 'next/image';
import Link from 'next/link';

const defaultProfile = "/defaultProfile.svg";

const ProductDetails = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const docRef = doc(db, "listings", id);
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					setProduct({ id: docSnap.id, ...docSnap.data() });
				} else {
					console.error("No such product!");
				}
			} catch (error) {
				console.error("Error fetching product:", error);
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchProduct();
	}, [id]);

	if (loading) return <div className="p-10 text-center">Loading product...</div>;

	if (!product) return <div className="p-10 text-center">Product not found.</div>;

	if (product.isSwapped) {
		return (
		  <div className="p-10 text-center text-maroon-900">
			<h2 className="text-2xl font-semibold mb-2">This item has already been swapped! 🤝</h2>
			<p className="text-gray-600">Check the Explore page for other listings available.</p>
			<Link
			  href="/explore"
			  className="inline-block mt-4 bg-maroon-900 hover:bg-maroon-700 text-white px-6 py-2 rounded-lg">
			  Back to Explore
			</Link>
		  </div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-4">{product.title}</h1>

			<div className="flex flex-col md:flex-row gap-8">
				<div className="relative w-full md:w-1/2 h-96 border rounded-xl overflow-hidden">
					<Image
						src={product.image}
						alt={product.title}
						fill
						className="object-cover"
					/>
				</div>

				<div className="md:w-1/2">
					<p className="mb-2">
						<strong>Description:</strong> {product.description || 'No description'}
					</p>
					<p className="mb-2">
						<strong>Category:</strong> {product.category}
					</p>
					<p className="mb-2">
						<strong>Type:</strong> {product.giveAway ? 'Giveaway' : 'Swap'}
					</p>

					<div className="flex items-center gap-3 mt-4">
						<Image
							src={product.owner?.avatar || defaultProfile}
							alt="Owner Avatar"
							width={50}
							height={50}
							className="rounded-full object-cover w-12 h-12"
						/>
						<div className="font-semibold capitalize">
							{product.owner?.name || 'Unknown'}
						</div>
					</div>

					{/* Swap button */}
					<Link
						href={`/swap/${product.id}`} // Or any future swap handling page
						className="inline-block mt-6 bg-[#101827] text-white px-6 py-2 rounded hover:bg-[#1f2937]"
					>
						Request Swap
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
