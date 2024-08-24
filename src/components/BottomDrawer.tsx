import React, { useState } from "react";
import { Drawer, Tabs, Tab, Button, Box, IconButton } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import SensorsIcon from "@mui/icons-material/Sensors";
import RadarIcon from "@mui/icons-material/Radar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ToysIcon from "@mui/icons-material/Toys";

import sensorData from "../sensor_stocks.json"; // 引入 JSON 文件

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

interface SensorProps {
  icon: React.ReactElement;
  name: string;
}

const Sensor: React.FC<SensorProps> = ({ icon, name }) => {
  return (
    <Box
      sx={{
        width: "80px",
        height: "80px",
        backgroundColor: "#f0f0f0",
        borderRadius: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "8px",
      }}
    >
      {icon}
    </Box>
  );
};

const BottomDrawer: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
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
      return <Sensor key={sensor.id} icon={icon} name={sensor.name} />;
    });
  };

  return (
    <>
      {/* 扁平按钮，使用图标提示可展开 */}
      <Button
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "40px",
          backgroundColor: "rgb(253,245,230,0.3)",
          borderRadius: "10px 10px 0 0",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ExpandLessIcon sx={{ fontSize: "24px" }} />
      </Button>

      {/* 抽屉面板，背景不灰掉 */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          ".MuiDrawer-paper": { borderRadius: "16px 16px 0 0" },
        }}
        ModalProps={{
          BackdropProps: {
            style: {
              backgroundColor: "transparent", // 背景不变灰
            },
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
              {/* 添加传感器按钮 */}
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
