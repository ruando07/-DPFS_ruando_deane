import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  return (
    <div>
      {product ? (
        <>
          <h2>{product.name}</h2>
          <img src={product.imageUrl} alt={product.name} />
          <p>{product.description}</p>
          <p>${product.price}</p>
          <button>Add to Cart</button>
        </>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetail;
