import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface VehiclePanelProps {
  // onClose: () => void;
}

const VehiclePanel: React.FC<VehiclePanelProps> = () => {
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

export default VehiclePanel;
