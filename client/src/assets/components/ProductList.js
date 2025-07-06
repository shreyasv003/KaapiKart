import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
};

export default ProductList;
