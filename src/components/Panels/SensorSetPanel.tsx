import React, { useState } from "react";
import { Box, Button, Divider, IconButton } from "@mui/material";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import RadarOutlinedIcon from "@mui/icons-material/RadarOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import ToysOutlinedIcon from "@mui/icons-material/ToysOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { ExpandLessOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import SensorStockItem from "../SensorStock";
import CreateSensorDialog from "../Dialogs/CreateSensorDialog";
import { SensorItem, SensorStocks } from "../../types/Common";
import Sensor from "../../types/Sensor";
import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";

interface SensorSetPanelProps {
  sensorStocks: SensorStocks;
  setSensorStocks: React.Dispatch<React.SetStateAction<SensorStocks>>;
  setSensorConfiguration: React.Dispatch<React.SetStateAction<Sensor[]>>;
}

const SensorSetPanel: React.FC<SensorSetPanelProps> = ({
  sensorStocks,
  setSensorStocks,
  setSensorConfiguration,
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const sensorTypes = ["USS", "Lidar", "Radar", "Camera"];
  const [selectedType, setSelectedType] = useState("USS");

  const categorizedSensors: { [key: string]: SensorItem[] } =
    sensorTypes.reduce((acc, type) => {
      acc[type.toLowerCase()] = Object.values(sensorStocks).filter(
        (sensor) => sensor.type === type.toLowerCase()
      );
      return acc;
    }, {} as { [key: string]: SensorItem[] });

  const handleEdit = (editedSensor: SensorItem) => {
    const updatedSensorStocks = {
      ...sensorStocks,
      [editedSensor.id]: editedSensor,
    };
    setSensorStocks(updatedSensorStocks);
    localStorage.setItem("sensorStocks", JSON.stringify(updatedSensorStocks));
  };

  const handleDialogOpen = (type: string) => {
    setDialogOpen(true);
    setSelectedType(type);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleCreateSensor = (newSensor: SensorItem) => {
    if (!sensorStocks) return;

    const updatedSensorStocks = {
      ...sensorStocks,
      [newSensor.id]: newSensor,
    };

    setSensorStocks(updatedSensorStocks);
    localStorage.setItem("sensorStocks", JSON.stringify(updatedSensorStocks));
    handleDialogClose();
  };

  const handleDelete = (id: string) => {
    if (!sensorStocks) return;

    const { [id]: _, ...remainingSensors } = sensorStocks;
    setSensorStocks(remainingSensors);
    localStorage.setItem("sensorStocks", JSON.stringify(remainingSensors));
  };

  const renderSensors = (type: string) => {
    return categorizedSensors[type.toLowerCase()].map((sensor) => {
      let icon;
      switch (sensor.type) {
        case "uss":
          icon = <SensorsOutlinedIcon sx={{ fontSize: "40px" }} />;
          break;
        case "lidar":
          icon = <ToysOutlinedIcon sx={{ fontSize: "40px" }} />;
          break;
        case "radar":
          icon = <RadarOutlinedIcon sx={{ fontSize: "40px" }} />;
          break;
        case "camera":
          icon = <CameraAltOutlinedIcon sx={{ fontSize: "40px" }} />;
          break;
        default:
          icon = <SensorsOutlinedIcon sx={{ fontSize: "40px" }} />;
      }

      return (
        <SensorStockItem
          key={sensor.id}
          icon={icon}
          sensor={sensor}
          setSensorConfiguration={setSensorConfiguration}
          onEdit={handleEdit}
          onDelete={() => handleDelete(sensor.id)}
        />
      );
    });
  };

  return (
    <>
      {sensorTypes.map((type, index) => (
        <Box key={index}>
          <Box sx={{ fontSize: "16px", marginBottom: "4px" }}>{type}</Box>
          <Divider sx={{ flexGrow: 1 }} />
          <Box display="flex" flexWrap="wrap">
            {renderSensors(type)}
            <Box onClick={() => handleDialogOpen(type)}>
              <IconButton>
                <AddTwoToneIcon sx={{ fontSize: "40px" }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      ))}
      <CreateSensorDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onCreate={handleCreateSensor}
        existingTypes={Object.values(sensorTypes || {})} // 将现有类型传递给对话框
        defaultType={selectedType}
      />
    </>
  );
};

export default SensorSetPanel;
