'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProductById } from '@/utils/firestoreUtils'; // adjust path if needed

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      getProductById(id).then(setProduct);
    }
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} width="300" />
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Owner:</strong> {product.ownerName}</p>
      <p><strong>Category:</strong> {product.category}</p>

      {/* Add swap button or link */}
      <button>Request Swap</button>
    </div>
  );
}
