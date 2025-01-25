import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface SamplePanelProps {
  // onClose: () => void;
}

const SamplePanel: React.FC<SamplePanelProps> = () => {
  return (
    <Box
      sx={{
        padding: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f5f5f5",
      }}
    ></Box>
  );
};

export default SamplePanel;
