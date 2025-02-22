import React, { useState, useEffect } from "react";
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
  FormHelperText,
  ListSubheader,
} from "@mui/material";
import { SensorItem } from "../../types/Common";
import { Vehicle } from "../../types/Vehicle";
import { SelectChangeEvent } from "@mui/material/Select";

interface InstallConfigDialogProps {
  open: boolean;
  sensorItem: SensorItem;
  vehicle: Vehicle;
  onClose: () => void;
  onConfirm: (
    selectedSensor: SensorItem,
    selectedPosition: string,
    orientation: number
  ) => void;
}

const InstallConfigDialog: React.FC<InstallConfigDialogProps> = ({
  open,
  sensorItem,
  vehicle,
  onClose,
  onConfirm,
}) => {
  const [selectedPosition, setSelectedPosition] = useState("");
  const [orientation, setOrientation] = useState<number>(0);
  const [positionError, setPositionError] = useState(false);
  const [mountingPointsByType, setMountingPointsByType] = useState<
    Record<string, string[]>
  >({});
  const [mountingPoint, setMountingPoint] = useState<string>("");
  const [defaultOrientation, setDefaultOrientation] = useState<number>(0);

  useEffect(() => {
    // Get and organize mounting point data
    const mountingPoints = vehicle.getMountingPoints();
    const groupedMountingPoints = Object.entries(mountingPoints).reduce(
      (acc, [name, point]) => {
        const type = point.type || "other";
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(name);
        return acc;
      },
      {} as Record<string, string[]>
    );
    setMountingPointsByType(groupedMountingPoints);
  }, [vehicle]);

  useEffect(() => {
    // Get default orientation of selected mounting point
    if (mountingPoint) {
      const point = vehicle.getMountingPoint(mountingPoint);
      if (point?.orientation !== undefined) {
        setDefaultOrientation(point.orientation);
      }
    }
  }, [mountingPoint, vehicle]);

  const handlePositionChange = (event: SelectChangeEvent) => {
    const selectedPoint = event.target.value;
    setMountingPoint(selectedPoint);
    // Set default orientation of selected mounting point
    const point = vehicle.getMountingPoint(selectedPoint);
    if (point?.orientation !== undefined) {
      setDefaultOrientation(point.orientation);
    }
    setOrientation(0); // Reset to 0 as we'll add mounting point's default orientation when saving
  };

  const handleSave = () => {
    if (!mountingPoint) {
      return;
    }

    // Get actual orientation of selected mounting point (including default orientation)
    const point = vehicle.getMountingPoint(mountingPoint);
    const actualOrientation = (point?.orientation || 0) + (orientation || 0);

    onConfirm(sensorItem, mountingPoint, actualOrientation);
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

  // 获取当前选中挂载点的实际方向（包括默认方向）
  const mountPoint = vehicle.getMountingPoint(selectedPosition);
  const actualOrientation = orientation + (mountPoint?.orientation || 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Please Choose Installation Position</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 2 }}>
          <FormControl fullWidth error={positionError}>
            <InputLabel id="install-position-label">
              Install Position
            </InputLabel>
            <Select
              labelId="install-position-label"
              value={mountingPoint}
              onChange={handlePositionChange}
              label="Install Position"
            >
              {/* Front mounting points */}
              {mountingPointsByType.front &&
                mountingPointsByType.front.length > 0 && [
                  <ListSubheader key="front-header">
                    Front Mounting Points
                  </ListSubheader>,
                  ...mountingPointsByType.front.map((point) => (
                    <MenuItem key={point} value={point}>
                      {point}
                    </MenuItem>
                  )),
                ]}

              {/* Rear mounting points */}
              {mountingPointsByType.rear &&
                mountingPointsByType.rear.length > 0 && [
                  <ListSubheader key="rear-header">
                    Rear Mounting Points
                  </ListSubheader>,
                  ...mountingPointsByType.rear.map((point) => (
                    <MenuItem key={point} value={point}>
                      {point}
                    </MenuItem>
                  )),
                ]}

              {/* Side mounting points */}
              {mountingPointsByType.side &&
                mountingPointsByType.side.length > 0 && [
                  <ListSubheader key="side-header">
                    Side Mounting Points
                  </ListSubheader>,
                  ...mountingPointsByType.side.map((point) => (
                    <MenuItem key={point} value={point}>
                      {point}
                    </MenuItem>
                  )),
                ]}

              {/* Roof mounting points */}
              {mountingPointsByType.roof &&
                mountingPointsByType.roof.length > 0 && [
                  <ListSubheader key="roof-header">
                    Roof Mounting Points
                  </ListSubheader>,
                  ...mountingPointsByType.roof.map((point) => (
                    <MenuItem key={point} value={point}>
                      {point}
                    </MenuItem>
                  )),
                ]}
            </Select>
            {positionError && (
              <FormHelperText error>
                Please select an installation position.
              </FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Additional Orientation Adjustment (degrees)
          </Typography>
          <Typography variant="caption" color="textSecondary" display="block">
            Default orientation: {defaultOrientation}°
          </Typography>
          <Typography
            variant="caption"
            color="textSecondary"
            display="block"
            sx={{ mb: 2 }}
          >
            Final orientation: {actualOrientation}°
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
            label="Additional Orientation"
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
