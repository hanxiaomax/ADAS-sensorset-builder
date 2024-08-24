import React, { useState } from "react";
import { Drawer, Tabs, Tab, Button, Box, IconButton } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import SensorsIcon from "@mui/icons-material/Sensors"; // 代表 USS 传感器
import RadarIcon from "@mui/icons-material/Radar"; // 代表雷达传感器
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // 代表摄像头传感器
import ToysIcon from "@mui/icons-material/Toys"; // 代表激光雷达传感器

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
}

const Sensor: React.FC<SensorProps> = ({ icon }) => {
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
          width: "100vw", // 设置按钮宽度为屏幕宽度的60%
          height: "40px", // 增大按钮的高度
          backgroundColor: "rgb(253,245,230,0.3)",
          borderRadius: "10px 10px 0 0",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ExpandLessIcon sx={{ fontSize: "24px" }} /> {/* 调整图标大小 */}
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
          <Tab label="USS Sensors" />
          <Tab label="Lidar Sensors" />
          <Tab label="Radar Sensors" />
          <Tab label="Camera Sensors" />
        </Tabs>

        {/* USS Sensors Tab */}
        <TabPanel value={selectedTab} index={0}>
          <Box display="flex" flexWrap="wrap">
            <Sensor icon={<SensorsIcon sx={{ fontSize: "40px" }} />} />
            <Sensor icon={<SensorsIcon sx={{ fontSize: "40px" }} />} />
            <Sensor icon={<SensorsIcon sx={{ fontSize: "40px" }} />} />
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

        {/* Lidar Sensors Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Box display="flex" flexWrap="wrap">
            <Sensor icon={<ToysIcon sx={{ fontSize: "40px" }} />} />
            <Sensor icon={<ToysIcon sx={{ fontSize: "40px" }} />} />
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

        {/* Radar Sensors Tab */}
        <TabPanel value={selectedTab} index={2}>
          <Box display="flex" flexWrap="wrap">
            <Sensor icon={<RadarIcon sx={{ fontSize: "40px" }} />} />
            <Sensor icon={<RadarIcon sx={{ fontSize: "40px" }} />} />
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

        {/* Camera Sensors Tab */}
        <TabPanel value={selectedTab} index={3}>
          <Box display="flex" flexWrap="wrap">
            <Sensor icon={<CameraAltIcon sx={{ fontSize: "40px" }} />} />
            <Sensor icon={<CameraAltIcon sx={{ fontSize: "40px" }} />} />
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
      </Drawer>
    </>
  );
};

export default BottomDrawer;
