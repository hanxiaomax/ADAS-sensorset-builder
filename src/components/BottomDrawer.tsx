import React, { useState } from "react";
import {
  Drawer,
  Tabs,
  Tab,
  Button,
  Box,
  IconButton,
  Tooltip,
  Badge,
  Chip,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import SensorsIcon from "@mui/icons-material/Sensors";
import RadarIcon from "@mui/icons-material/Radar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ToysIcon from "@mui/icons-material/Toys";
import CloseIcon from "@mui/icons-material/Close";

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
  isNew?: boolean;
}

const Sensor: React.FC<SensorProps> = ({ icon, name, isNew }) => {
  return (
    <Tooltip title={name} arrow>
      <Badge
        badgeContent={
          isNew ? <Chip label="New" color="primary" size="small" /> : null
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        overlap="circular"
        sx={{
          "& .MuiBadge-badge": {
            transform: "translate(25%, -25%)",
            borderRadius: "8px",
          },
        }}
      >
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
            position: "relative",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {icon}
        </Box>
      </Badge>
    </Tooltip>
  );
};

const BottomDrawer: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // 定义 renderSensors 函数
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
        />
      );
    });
  };

  return (
    <>
      {/* 扁平按钮，鼠标悬浮时打开面板 */}
      <Button
        onMouseEnter={() => setDrawerOpen(true)} // 悬浮时打开面板
        sx={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100vw",
          height: "40px",
          backgroundColor: "rgba(253,245,230,0.3)",
          borderRadius: "10px 10px 0 0",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300, // 确保按钮在其他元素上方
        }}
      >
        <ExpandLessIcon sx={{ fontSize: "24px" }} />
      </Button>

      {/* 抽屉面板，保持在底部，背景不灰掉 */}
      <Drawer
        anchor="bottom" // 确保面板从底部弹出
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        hideBackdrop // 隐藏Backdrop，以免阻挡顶部按钮的点击
        sx={{
          ".MuiDrawer-paper": {
            borderRadius: "16px 16px 0 0",
            width: "80%", // 设置宽度为屏幕宽度的80%
            margin: "0 auto", // 居中显示
            position: "fixed", // 保证面板在屏幕底部固定
            bottom: 0, // 让面板固定在底部
            zIndex: 1200, // 确保面板在按钮之下
          },
        }}
      >
        {/* 关闭按钮，位于面板右上角 */}
        <IconButton
          onClick={() => setDrawerOpen(false)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

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
