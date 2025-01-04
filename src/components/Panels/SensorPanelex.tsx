import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface SensorPanelExProps {
  // onClose: () => void;
}

const SensorPanelEx: React.FC<SensorPanelExProps> = () => {
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
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          Sample Panel
        </Typography>
        <Typography variant="body1">
          This is a sample panel content. You can add your own components or
          content here to customize it.
        </Typography>
      </Box>
      <Button variant="contained" color="primary">
        Close Panel
      </Button>
    </Box>
  );
};

export default SensorPanelEx;
