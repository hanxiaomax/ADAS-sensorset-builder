import React, { useEffect, useState } from "react";
import { Drawer, Tabs, Tab, Button, Box, IconButton } from "@mui/material";
import SensorsIcon from "@mui/icons-material/Sensors";
import RadarIcon from "@mui/icons-material/Radar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ToysIcon from "@mui/icons-material/Toys";
import AddIcon from "@mui/icons-material/Add";
import { ExpandLessOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import SensorStockItem from "./SensorStock";
import CreateSensorDialog from "../components/CreateSensorDialog";
import { Sensor, SensorItem, SensorStocks } from "../types/Common";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface BottomDrawerProps {
  sensorStocks: SensorStocks;
  setSensorStocks: React.Dispatch<React.SetStateAction<SensorStocks>>;
  setSensorConfiguration: React.Dispatch<React.SetStateAction<Sensor[]>>;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  sensorStocks,
  setSensorStocks,
  setSensorConfiguration,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // 用于控制对话框的打开状态
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedType, setSelectedType] = useState("uss");

  // 按type分类传感器
  const sensorTypes = ["uss", "lidar", "radar", "camera"];
  useEffect(() => {
    if (sensorStocks) {
      setSelectedTab(0);
    }
  }, [sensorStocks]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleEdit = (editedSensor: SensorItem) => {
    const updatedSensorStocks = {
      ...sensorStocks,
      [editedSensor.id]: editedSensor,
    };
    setSensorStocks(updatedSensorStocks);
    localStorage.setItem("sensorStocks", JSON.stringify(updatedSensorStocks));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
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
  const categorizedSensors: { [key: string]: SensorItem[] } =
    sensorTypes.reduce((acc, type) => {
      acc[type] = Object.values(sensorStocks).filter(
        (sensor) => sensor.type === type
      );
      return acc;
    }, {} as { [key: string]: SensorItem[] });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setSelectedType(sensorTypes[newValue]);
  };

  const renderSensors = (type: string) => {
    return categorizedSensors[type].map((sensor) => {
      let icon;
      switch (sensor.type) {
        case "uss":
          icon = <SensorsIcon sx={{ fontSize: "40px" }} />;
          break;
        case "lidar":
          icon = <ToysIcon sx={{ fontSize: "40px" }} />;
          break;
        case "radar":
          icon = <RadarIcon sx={{ fontSize: "40px" }} />;
          break;
        case "camera":
          icon = <CameraAltIcon sx={{ fontSize: "40px" }} />;
          break;
        default:
          icon = <SensorsIcon sx={{ fontSize: "40px" }} />;
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
      <Button
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          color: "black",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "50vw",
          height: "30px",
          backgroundColor: "rgba(20, 98, 118, 0.1)",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
          "&:hover": {
            backgroundColor: "rgba(20, 98, 118, 0.4)", // 悬停时的背景色
          },
        }}
      >
        {drawerOpen ? (
          <ExpandMoreOutlined sx={{ fontSize: "24px" }} />
        ) : (
          <ExpandLessOutlined sx={{ fontSize: "24px" }} />
        )}
      </Button>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer}
        variant="persistent"
        hideBackdrop
        PaperProps={{
          sx: {
            borderRadius: "16px 16px 0 0",
            width: "50vw",
            height: "240px",
            margin: "0 auto",
            position: "fixed",
            bottom: 0,
            zIndex: 1200,
            boxShadow: "0px 1px 1px 1px #fefe",
          },
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="sensor types"
          variant="fullWidth"
        >
          {sensorTypes.map((type, index) => (
            <Tab key={index} label={type.toUpperCase()} />
          ))}
        </Tabs>
        {sensorTypes.map((type, index) => (
          <TabPanel key={index} value={selectedTab} index={index}>
            <Box display="flex" flexWrap="wrap">
              {renderSensors(type)}
              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "16px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "8px",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  },
                }}
                onClick={handleDialogOpen}
              >
                <IconButton>
                  <AddIcon sx={{ fontSize: "40px" }} />
                </IconButton>
              </Box>
            </Box>
          </TabPanel>
        ))}
      </Drawer>

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

export default BottomDrawer;
