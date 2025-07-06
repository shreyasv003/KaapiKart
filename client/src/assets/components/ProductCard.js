import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

const ProductCard = ({ product, addToCart }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{product.name}</Typography>
        <Typography>{product.description}</Typography>
        <Typography>₹{product.price}</Typography>
        <Button onClick={() => addToCart(product)} variant="contained" color="primary">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
