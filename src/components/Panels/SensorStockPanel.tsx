import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import RadarOutlinedIcon from "@mui/icons-material/RadarOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import ToysOutlinedIcon from "@mui/icons-material/ToysOutlined";
import SensorStockItem from "../SensorStock";
import CreateSensorDialog from "../Dialogs/CreateSensorDialog";
import { SensorItem, SensorStocks } from "../../types/Common";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { HtmlTooltip } from "../ToolTips";
import { useSensorStore } from "../../stores/sensorStore";
import { FileUpload, FileDownload } from "@mui/icons-material";
import notifier from "../Helper/Notification";

interface SensorStackPanelProps {}

const SensorStackPanel: React.FC<SensorStackPanelProps> = ({}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const sensorTypes = ["USS", "Lidar", "Radar", "Camera"];
  const [selectedType, setSelectedType] = useState("USS");
  const {
    sensorConfiguration,
    setSensorConfiguration,
    sensorStocks,
    setSensorStocks,
  } = useSensorStore();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<string>("auto");
  const [showScrollbar, setShowScrollbar] = useState(false);

  // 计算容器高度，使其自适应
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const windowHeight = window.innerHeight;
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const availableHeight = windowHeight - containerTop - 40; // 40px 作为底部边距

        // 计算内容高度
        const contentHeight = calculateContentHeight();

        // 如果内容高度超过可用高度，或者屏幕较小，则显示滚动条
        if (contentHeight > availableHeight || isSmallScreen) {
          setContainerHeight(`${availableHeight}px`);
          setShowScrollbar(true);
        } else {
          // 否则使用内容的实际高度，不显示滚动条
          setContainerHeight("auto");
          setShowScrollbar(false);
        }
      }
    };

    // 计算内容的实际高度
    const calculateContentHeight = () => {
      if (!containerRef.current) return 0;

      // 克隆节点以测量其自然高度
      const clone = containerRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.height = "auto";
      clone.style.maxHeight = "none";
      clone.style.overflow = "visible";
      document.body.appendChild(clone);

      const height = clone.offsetHeight;
      document.body.removeChild(clone);

      return height;
    };

    // 初始设置为自动高度
    setContainerHeight("auto");

    // 延迟执行高度计算，确保DOM已完全渲染
    const timer = setTimeout(() => {
      updateHeight();
    }, 100);

    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
      clearTimeout(timer);
    };
  }, [isSmallScreen, sensorStocks]); // 当传感器数据变化时也重新计算

  const categorizedSensors: { [key: string]: SensorItem[] } =
    sensorTypes.reduce((acc, type) => {
      acc[type.toLowerCase()] = Object.values(sensorStocks).filter(
        (sensor) => sensor.type === type.toLowerCase()
      );
      return acc;
    }, {} as { [key: string]: SensorItem[] });

  // 验证SensorStocks的结构
  const isValidSensorStock = (data: any): data is SensorStocks => {
    return (
      typeof data === "object" && data !== null && Object.keys(data).length > 0
    );
  };

  const handleImportSensorDatabase = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (isValidSensorStock(data)) {
            setSensorStocks(data);
            notifier.success("Sensor Database imported successfully!");
          } else {
            throw new Error("Invalid Sensor Database format.");
          }
        } catch (error) {
          const errorMessage = (error as Error).message.replace("Error: ", "");
          notifier.error(errorMessage);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  const handleExportSensorDatabase = () => {
    const stockDataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sensorStocks, null, 2));
    const stockDownloadNode = document.createElement("a");
    stockDownloadNode.setAttribute("href", stockDataStr);
    stockDownloadNode.setAttribute("download", "sensor_database.json");
    document.body.appendChild(stockDownloadNode);
    stockDownloadNode.click();
    stockDownloadNode.remove();
    notifier.success("Sensor Database exported successfully!");
  };

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

    // 合并新旧传感器配置
    const updatedSensorStocks = {
      ...sensorStocks,
      [newSensor.id]: {
        ...newSensor,
        configuration: {
          ...(sensorStocks[newSensor.id]?.configuration || {}),
          ...newSensor.configuration,
        },
      },
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
          onEdit={handleEdit}
          onDelete={() => handleDelete(sensor.id)}
        />
      );
    });
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        height: containerHeight,
        overflow: showScrollbar ? "auto" : "visible",
        "&::-webkit-scrollbar": {
          width: "8px",
          display: showScrollbar ? "block" : "none",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "rgba(0,0,0,0.05)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Stack direction="row" spacing={1}>
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit" variant="body2">
                  Import Sensor Database
                </Typography>
              </React.Fragment>
            }
          >
            <IconButton
              size="small"
              onClick={handleImportSensorDatabase}
              sx={{
                color: theme.palette.primary.main,
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <FileUpload fontSize="small" />
            </IconButton>
          </HtmlTooltip>

          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit" variant="body2">
                  Export Sensor Database
                </Typography>
              </React.Fragment>
            }
          >
            <IconButton
              size="small"
              onClick={handleExportSensorDatabase}
              sx={{
                color: theme.palette.primary.main,
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.08)",
                },
              }}
            >
              <FileDownload fontSize="small" />
            </IconButton>
          </HtmlTooltip>
        </Stack>
      </Box>

      {sensorTypes.map((type, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ fontSize: "16px", marginBottom: "4px" }}>{type}</Box>
          <Divider sx={{ flexGrow: 1 }} />
          <Box display="flex" flexWrap="wrap">
            {renderSensors(type)}
            <Box onClick={() => handleDialogOpen(type)}>
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography color="inherit">
                      Create new <u>{type}</u> sensor
                    </Typography>
                  </React.Fragment>
                }
              >
                <IconButton>
                  <AddTwoToneIcon sx={{ fontSize: "40px" }} />
                </IconButton>
              </HtmlTooltip>
            </Box>
          </Box>
        </Box>
      ))}
      <CreateSensorDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onCreate={handleCreateSensor}
        existingTypes={Object.values(sensorTypes || {})}
        defaultType={selectedType}
      />
    </Box>
  );
};

export default SensorStackPanel;
