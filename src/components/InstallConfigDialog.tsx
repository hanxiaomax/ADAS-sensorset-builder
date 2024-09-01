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
  Typography,
  Slider,
  TextField,
} from "@mui/material";

interface InstallConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedPosition: string, orientation: number) => void;
}

const InstallConfigDialog: React.FC<InstallConfigDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [selectedPosition, setSelectedPosition] = useState("");
  const [orientation, setOrientation] = useState<number>(0); // 默认值设置为0度
  const [mountingPoints, setMountingPoints] = useState<string[]>([]);

  useEffect(() => {
    const mountingPointsData = localStorage.getItem("mountingPoints");
    if (mountingPointsData) {
      const data = JSON.parse(mountingPointsData);
      setMountingPoints(Object.keys(data));
    }
  }, []);

  const handleSave = () => {
    onConfirm(selectedPosition, orientation);
    onClose();
  };

  const handleSliderChange = (event: Event, value: number | number[]) => {
    setOrientation(value as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= -180 && value <= 180) {
      setOrientation(value);
    }
  };

  const marks = [
    { value: -180, label: "-180°" },
    { value: -90, label: "-90°" },
    { value: 0, label: "0°" },
    { value: 90, label: "90°" },
    { value: 180, label: "180°" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Orientation (degrees)
          </Typography>
          <Slider
            value={orientation}
            min={-180}
            max={180}
            marks={marks}
            step={1}
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
            sx={{
              "& .MuiSlider-track": {
                height: 8,
                borderRadius: 4,
              },
              "& .MuiSlider-thumb": {
                width: 24,
                height: 24,
              },
              "& .MuiSlider-rail": {
                opacity: 0.5,
                backgroundColor: "#bfbfbf",
                height: 8,
                borderRadius: 4,
              },
            }}
          />
          <TextField
            value={orientation}
            onChange={handleInputChange}
            margin="dense"
            label="Orientation"
            type="number"
            fullWidth
            variant="standard"
            inputProps={{
              min: -180,
              max: 180,
            }}
            sx={{ mt: 2 }}
          />
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
