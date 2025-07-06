import React from "react";
import { Typography, Link, Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#333",
        color: "#fff",
        padding: "20px",
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      <Typography variant="body2" gutterBottom>
        &copy; {new Date().getFullYear()} Kaapikart. All rights reserved.
      </Typography>
      <Box>
        <Link href="#" color="inherit" sx={{ margin: "0 10px" }}>
          Terms & Conditions
        </Link>
        <Link href="#" color="inherit" sx={{ margin: "0 10px" }}>
          Privacy Policy
        </Link>
      </Box>
      <Box>
        <Link href="https://facebook.com" target="_blank" color="inherit" sx={{ margin: "0 10px" }}>
          Facebook
        </Link>
        <Link href="https://twitter.com" target="_blank" color="inherit" sx={{ margin: "0 10px" }}>
          Twitter
        </Link>
        <Link href="https://instagram.com" target="_blank" color="inherit" sx={{ margin: "0 10px" }}>
          Instagram
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
