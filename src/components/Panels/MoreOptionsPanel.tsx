import React from "react";
import { Box, Button, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

interface MoreOptionsPanelProps {
  onSaveScene: () => void;
  onLoadScene: () => void;
}

const MoreOptionsPanel: React.FC<MoreOptionsPanelProps> = ({
  onSaveScene,
  onLoadScene,
}) => {
  return (
    <Box sx={{ p: 2, minWidth: 200 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        More Options
      </Typography>
      <Button
        fullWidth
        onClick={onSaveScene}
        startIcon={<SaveIcon />}
        sx={{ mb: 1 }}
      >
        Save Scene
      </Button>
      <Button fullWidth onClick={onLoadScene} startIcon={<FolderOpenIcon />}>
        Load Scene
      </Button>
    </Box>
  );
};

export default MoreOptionsPanel;
