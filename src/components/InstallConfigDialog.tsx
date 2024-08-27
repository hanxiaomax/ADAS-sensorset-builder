import React from "react";
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
} from "@mui/material";

interface InstallConfigDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (selectedPosition: string) => void;
}

const InstallConfigDialog: React.FC<InstallConfigDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [selectedPosition, setSelectedPosition] = React.useState("");

  const handleSave = () => {
    onSave(selectedPosition);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Install Sensor</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="install-position-label">Install Position</InputLabel>
          <Select
            labelId="install-position-label"
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value as string)}
            label="Install Position"
          >
            <MenuItem value="Front">Front</MenuItem>
            <MenuItem value="Rear">Rear</MenuItem>
            <MenuItem value="Left">Left</MenuItem>
            <MenuItem value="Right">Right</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstallConfigDialog;
