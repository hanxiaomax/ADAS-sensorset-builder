import React, { useState } from "react";
import {
  Box,
  Popover,
  Card,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CardMedia,
} from "@mui/material";
import InstallConfigDialog from "./Dialogs/InstallConfigDialog";
import DeleteConfirmationDialog from "./Dialogs/DeleteConfirmationDialog";
import SensorInfoDialog from "./SensorInfoDialog";
import { SensorItem } from "../types/Common";
import { Sensor } from "../types/Sensor";
import { v4 as uuidv4 } from "uuid";
import { HtmlTooltip } from "./ToolTips";
import { useSceneStore } from "../stores/sceneStore";
import { useVehicleStore } from "../stores/vehicleStore";

interface SensorStockItemProps {
  icon: React.ReactElement;
  sensor: SensorItem;
  onDelete: (id: string) => void;
  onEdit: (editedSensor: SensorItem) => void;
}

const iconContainerStyles = {
  width: "60px",
  height: "60px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  borderRadius: "60px",
  "&:hover": {
    boxShadow: 1,
    borderRadius: "60px",
  },
};

const SensorStockItem: React.FC<SensorStockItemProps> = ({
  icon,
  sensor,
  onDelete,
  onEdit,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dialogState, setDialogState] = useState({
    install: false,
    delete: false,
    info: false,
  });

  const { addSensor } = useSceneStore();
  const { currentVehicle } = useVehicleStore();

  const handleDialog = (type: keyof typeof dialogState, open: boolean) => {
    setDialogState((prev) => ({ ...prev, [type]: open }));
  };

  const handleInstallConfirm = (
    selectedSensor: SensorItem,
    selectedPosition: string,
    orientation: number
  ) => {
    const mountPosition = {
      name: selectedPosition,
      position: currentVehicle?.getRelativeMountingPoint(selectedPosition)
        ?.position || { x: 0, y: 0 },
      orientation: orientation,
    };

    const newSensor = new Sensor(
      uuidv4(),
      selectedSensor,
      selectedPosition,
      mountPosition,
      { highlight: true },
      true,
      true
    );

    addSensor(newSensor);
    handleDialog("install", false);
  };

  const handleDeleteConfirm = () => {
    onDelete?.(sensor.id);
    handleDialog("delete", false);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box sx={iconContainerStyles} onClick={() => handleDialog("info", true)}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit">{sensor.name}</Typography>
                <Typography
                  fontStyle="italic"
                  sx={{ fontSize: "12px" }}
                  gutterBottom
                >
                  {sensor.desc}
                </Typography>

                <Box>
                  <Typography sx={{ fontSize: "13px" }}>
                    Brand: <u>{sensor.brand}</u>
                  </Typography>
                  <Typography sx={{ fontSize: "13px" }}>
                    Fov: <u>{sensor.spec.fov}</u>
                  </Typography>
                  <Typography sx={{ fontSize: "13px" }}>
                    Range: <u>{sensor.spec.range}</u>
                  </Typography>
                </Box>
              </React.Fragment>
            }
          >
            {icon}
          </HtmlTooltip>
        </Box>
      </Box>
      <Popover
        sx={{ pointerEvents: "none" }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={() => setAnchorEl(null)}
        disableRestoreFocus
      >
        <Card sx={{ maxWidth: 300 }}>
          <CardContent>
            <Typography variant="subtitle1" component="span">
              {sensor.name}
            </Typography>
          </CardContent>
          {sensor.image ? (
            <CardMedia
              component="img"
              height="140"
              image={sensor.image}
              alt={sensor.name}
              sx={{ objectFit: "contain" }}
            />
          ) : (
            <Box
              sx={{
                height: "140px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
              }}
            >
              {icon}
            </Box>
          )}
          <CardContent>
            {sensor.spec && (
              <Table size="small" aria-label="sensor specs">
                <TableBody>
                  {Object.entries(sensor.spec).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">
                        {key}
                      </TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Popover>
      {/* Install Config Dialog */}
      <InstallConfigDialog
        open={dialogState.install}
        sensorItem={sensor}
        vehicle={currentVehicle!}
        onClose={() => handleDialog("install", false)}
        onConfirm={handleInstallConfirm}
      />
      <DeleteConfirmationDialog
        open={dialogState.delete}
        onClose={() => handleDialog("delete", false)}
        onConfirm={handleDeleteConfirm}
        sensorName={sensor.name}
      />
      <SensorInfoDialog
        open={dialogState.info}
        onClose={() => handleDialog("info", false)}
        onInstall={() => handleDialog("install", true)}
        onRemove={() => handleDialog("delete", true)}
        onEdit={onEdit}
        sensor={sensor}
        icon={icon}
      />
    </Box>
  );
};

export default SensorStockItem;
