import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Button, Typography } from "@mui/material";

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <div>
      <Typography variant="h4">Your Cart</Typography>
      {cart.map((item) => (
        <div key={item._id}>
          <Typography>{item.name}</Typography>
          <Typography>₹{item.price}</Typography>
          <Button onClick={() => removeFromCart(item._id)} color="error">
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
