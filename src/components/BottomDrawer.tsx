import React, { useState } from "react";
import { Drawer, Tabs, Tab, Button, Box, IconButton } from "@mui/material";
import SensorsIcon from "@mui/icons-material/Sensors";
import RadarIcon from "@mui/icons-material/Radar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ToysIcon from "@mui/icons-material/Toys";
import AddIcon from "@mui/icons-material/Add";
import { ExpandLessOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import SensorStockItem from "./SensorStock";
import { SensorConfig, SensorStock } from "../types/Common";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface BottomDrawerProps {
  sensorStocks: SensorStock | undefined; // 定义外部传入的 prop 类型
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

const BottomDrawer: React.FC<BottomDrawerProps> = ({ sensorStocks }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderSensors = (sensorType: keyof SensorStock) => {
    if (!sensorStocks || !sensorStocks[sensorType]) {
      return null;
    }

    return sensorStocks[sensorType].sensors.map((sensor) => {
      let icon;
      switch (sensor.profile.type) {
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
          sensor={sensor as SensorConfig}
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
        PaperProps={{
          sx: {
            borderRadius: "16px 16px 0 0",
            width: "80vw",
            height: "230px",
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
          {sensorStocks &&
            Object.keys(sensorStocks).map((key, index) => (
              <Tab
                key={index}
                label={sensorStocks[key as keyof SensorStock].title}
              />
            ))}
        </Tabs>

        {sensorStocks &&
          Object.keys(sensorStocks).map((key, index) => (
            <TabPanel key={index} value={selectedTab} index={index}>
              <Box display="flex" flexWrap="wrap">
                {renderSensors(key as keyof SensorStock)}
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
