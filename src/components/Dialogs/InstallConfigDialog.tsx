import React, { useState } from "react";
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

  // 获取并组织挂载点数据
  const mountingPointGroups = {
    front: vehicle.getMountingPointsByType("front"),
    rear: vehicle.getMountingPointsByType("rear"),
    side: vehicle.getMountingPointsByType("side"),
    roof: vehicle.getMountingPointsByType("roof"),
  };

  const handleSave = () => {
    if (!selectedPosition) {
      setPositionError(true);
    } else {
      // 获取选中挂载点的默认方向
      const mountPoint = vehicle.getMountingPoint(selectedPosition);
      const finalOrientation = orientation + (mountPoint?.orientation || 0);
      onConfirm(sensorItem, selectedPosition, finalOrientation);
      onClose();
    }
  };

  const handlePositionChange = (value: string) => {
    setSelectedPosition(value);
    setPositionError(false);
    // 设置选中挂载点的默认方向
    const mountPoint = vehicle.getMountingPoint(value);
    if (mountPoint) {
      setOrientation(0); // 重置为0，因为我们会在保存时加上挂载点的默认方向
    }
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
              value={selectedPosition}
              onChange={(e) => handlePositionChange(e.target.value as string)}
              label="Install Position"
            >
              {/* 前部挂载点 */}
              {mountingPointGroups.front.length > 0 && [
                <ListSubheader key="front-header">
                  Front Mounting Points
                </ListSubheader>,
                ...mountingPointGroups.front.map((point) => (
                  <MenuItem key={point} value={point}>
                    {point}
                  </MenuItem>
                )),
              ]}

              {/* 后部挂载点 */}
              {mountingPointGroups.rear.length > 0 && [
                <ListSubheader key="rear-header">
                  Rear Mounting Points
                </ListSubheader>,
                ...mountingPointGroups.rear.map((point) => (
                  <MenuItem key={point} value={point}>
                    {point}
                  </MenuItem>
                )),
              ]}

              {/* 侧面挂载点 */}
              {mountingPointGroups.side.length > 0 && [
                <ListSubheader key="side-header">
                  Side Mounting Points
                </ListSubheader>,
                ...mountingPointGroups.side.map((point) => (
                  <MenuItem key={point} value={point}>
                    {point}
                  </MenuItem>
                )),
              ]}

              {/* 车顶挂载点 */}
              {mountingPointGroups.roof.length > 0 && [
                <ListSubheader key="roof-header">
                  Roof Mounting Points
                </ListSubheader>,
                ...mountingPointGroups.roof.map((point) => (
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
            Default orientation: {mountPoint?.orientation || 0}°
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
