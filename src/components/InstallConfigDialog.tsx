import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { SensorConfig } from "../types/Common";

interface InstallConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedPosition: string) => void;
}

const InstallConfigDialog: React.FC<InstallConfigDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [selectedPosition, setSelectedPosition] = useState("");
  const [mountingPoints, setMountingPoints] = useState<string[]>([]);

  useEffect(() => {
    const mountingPointsData = localStorage.getItem("mountingPoints");
    if (mountingPointsData) {
      const data = JSON.parse(mountingPointsData);
      setMountingPoints(Object.keys(data));
    }
  }, []);

  const handleSave = () => {
    onConfirm(selectedPosition);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm" // 设置对话框的最大宽度
      fullWidth // 让对话框占据整个宽度
    >
      <DialogTitle>Please Choose Installation Position</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="install-position-label">
              Install Position
            </InputLabel>
            <Select
              labelId="install-position-label"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value as string)}
              label="Install Position"
            >
              {mountingPoints.map((point) => (
                <MenuItem key={point} value={point}>
                  {point}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ minWidth: 100, color: "white", backgroundColor: "#0c7a92" }}
        >
          Confirm
        </Button>
        <Button onClick={onClose} sx={{ minWidth: 100 }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstallConfigDialog;
