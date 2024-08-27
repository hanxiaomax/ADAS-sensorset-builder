import React, { useState } from "react";
import {
  Drawer,
  Tabs,
  Tab,
  Button,
  Box,
  IconButton,
  Badge,
  Chip,
  Popover,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Table,
  TableBody,
  TableRow,
  TableCell,
  ButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SensorsIcon from "@mui/icons-material/Sensors";
import RadarIcon from "@mui/icons-material/Radar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ToysIcon from "@mui/icons-material/Toys";

import sensorData from "../sensor_stocks.json"; // 引入 JSON 文件
import {
  AddReactionTwoTone,
  ExpandLessOutlined,
  ExpandMoreOutlined,
} from "@mui/icons-material";

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
  description: string;
  specs?: { [key: string]: string };
  image?: string; // 添加 image 字段，用于传递图片链接
}

const Sensor: React.FC<SensorProps> = ({
  icon,
  name,
  isNew,
  description,
  specs,
  image,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hover, setHover] = useState(false);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
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
            width: "180px",
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
          onClick={handlePopoverClose} // 点击时关闭 Popover
          onMouseEnter={handlePopoverOpen} // 鼠标移入时打开 Popover
          onMouseLeave={handlePopoverClose} // 鼠标移出时关闭 Popover
        >
          {icon}
        </Box>
      </Badge>

      {/* Use 按钮，仅在悬停时显示 */}
      <ButtonGroup
        disableElevation
        variant="outlined"
        size="small"
        sx={{
          "& .MuiButtonBase-root": {
            backgroundColor: hover ? "#f6f6f6" : "transparent", // 背景颜色在悬停时改变
            width: "60px",
            height: "30px",
            color: "#111111", // 文字颜色
            border: 0, // 移除边框
            boxShadow: "none", // 移除阴影
            textTransform: "none", // 保持文本的原始格式（不大写）
            display: hover ? "block" : "none", // 根据 hover 状态显示或隐藏按钮
            "&:hover": {
              backgroundColor: "#e0e0e0", // 悬停时的背景色
            },
          },
        }}
      >
        <Button>Install</Button>
        <Button>Edit</Button>
        <Button>Details</Button>
      </ButtonGroup>

      {/* Popover 显示详细信息卡片 */}
      <Popover
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Card sx={{ maxWidth: 300 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              {name}
            </Typography>
          </CardContent>
          {image ? (
            <CardMedia
              component="img"
              height="140"
              image={image} // 使用 JSON 中的 image 字段
              alt={name}
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
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
            {specs && (
              <Table size="small" aria-label="sensor specs">
                <TableBody>
                  {Object.entries(specs).map(([key, value]) => (
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
    </Box>
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
