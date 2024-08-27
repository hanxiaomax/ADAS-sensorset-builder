import React, { useState } from "react";
import { Drawer, Tabs, Tab, Button, Box, IconButton } from "@mui/material";
import SensorsIcon from "@mui/icons-material/Sensors";
import RadarIcon from "@mui/icons-material/Radar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ToysIcon from "@mui/icons-material/Toys";
import AddIcon from "@mui/icons-material/Add";
import sensorData from "../sensor_stocks.json"; // 引入 JSON 文件
import { ExpandLessOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import Sensor from "./Sensor"; // 引入更新后的 Sensor 组件

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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

const BottomDrawer: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderSensors = (sensorType: keyof typeof sensorData) => {
    return sensorData[sensorType].sensors.map((sensor) => {
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
        <Sensor
          key={sensor.id}
          icon={icon}
          name={sensor.name}
          isNew={sensor.isNew}
          description={sensor.description}
          specs={sensor.specs}
          image={sensor.image}
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
          width: "80vw",
          height: "30px",
          backgroundColor: "#ece2dc",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
          "&:hover": {
            backgroundColor: "#d2b29f", // 悬停时的背景色
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
        sx={{
          ".MuiDrawer-paper": {
            borderRadius: "16px 16px 0 0",
            width: "80%",
            height: "230px",
            margin: "0 auto",
            position: "fixed",
            bottom: 0,
            zIndex: 1200,
          },
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="sensor types"
          variant="fullWidth"
        >
          {Object.keys(sensorData).map((key, index) => (
            <Tab
              key={index}
              label={sensorData[key as keyof typeof sensorData].title}
            />
          ))}
        </Tabs>

        {Object.keys(sensorData).map((key, index) => (
          <TabPanel key={index} value={selectedTab} index={index}>
            <Box display="flex" flexWrap="wrap">
              {renderSensors(key as keyof typeof sensorData)}
              <Box
                sx={{
                  width: "180px",
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
              >
                <IconButton>
                  <AddIcon sx={{ fontSize: "40px" }} />
                </IconButton>
              </Box>
            </Box>
          </TabPanel>
        ))}
      </Drawer>
    </>
  );
};

export default BottomDrawer;
