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
  TableBody,
  Table,
  TableRow,
  TableCell,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SensorsIcon from "@mui/icons-material/Sensors";
import RadarIcon from "@mui/icons-material/Radar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ToysIcon from "@mui/icons-material/Toys";
import sensorData from "../sensor_stocks.json"; // 引入 JSON 文件
import { ExpandMore } from "@mui/icons-material";
import styles from "./BottomDrawer.module.css"; // 引入样式模块

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
    <>
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
          className={styles.sensorBox} // 使用外部样式
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          {icon}
        </Box>
      </Badge>

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
    </>
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
      <Button onClick={toggleDrawer} className={styles.drawerButton}>
        {drawerOpen ? (
          <ExpandMore sx={{ fontSize: "35px" }} />
        ) : (
          <ExpandLessIcon sx={{ fontSize: "35px" }} />
        )}
      </Button>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer}
        hideBackdrop
        sx={{
          ".MuiDrawer-paper": {
            className: styles.drawerPaper, // 使用外部样式
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
              <Box className={styles.addSensorBox}>
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
