import React from "react";
import "./loader.css"; // Ensure you create a corresponding CSS file
import { Box } from "@mui/material";

export const Loader = () => {
  return (
    <Box className="loader-container">
      <Box
        className="loader"
        sx={{ width: { xs: "50px", sm: "75px", md: "100px" } }}
      ></Box>
    </Box>
  );
};
