import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { HtmlTooltip } from "../ToolTips";
import { useVehicleStore } from "../../stores/vehicleStore";
import { useSceneStore } from "../../stores/sceneStore";
import { SedanVehicle } from "../../types/vehicles/SedanVehicle";
import { SuvVehicle } from "../../types/vehicles/SuvVehicle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import notifier from "../Helper/Notification";

interface VehiclePanelProps {}

const VehiclePanel: React.FC<VehiclePanelProps> = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<string>("auto");
  const [showScrollbar, setShowScrollbar] = useState(false);

  const { setCurrentVehicle, currentVehicle } = useVehicleStore();
  const { setVehicle, vehicle } = useSceneStore();

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
  }, [isSmallScreen]);

  // 处理切换为轿车
  const handleSwitchToSedan = () => {
    try {
      // 获取舞台尺寸（这里使用一个合理的默认值）
      const stageSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      // 创建轿车实例
      const sedan = new SedanVehicle(stageSize, 100); // 100是缩放因子

      // 加载车辆图片
      const img = new Image();
      img.src = sedan.imagePath;
      img.onload = () => {
        sedan.setImage(img);
        // 更新车辆状态
        setCurrentVehicle(sedan);
        setVehicle(sedan);
        notifier.success("已切换为轿车");
      };
      img.onerror = () => {
        notifier.error("无法加载轿车图片");
      };
    } catch (error) {
      console.error("切换轿车时出错:", error);
      notifier.error("切换轿车失败");
    }
  };

  // 处理切换为SUV
  const handleSwitchToSuv = () => {
    try {
      // 获取舞台尺寸（这里使用一个合理的默认值）
      const stageSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      // 创建SUV实例
      const suv = new SuvVehicle(stageSize, 100); // 100是缩放因子

      // 加载车辆图片
      const img = new Image();
      img.src = suv.imagePath;
      img.onload = () => {
        suv.setImage(img);
        // 更新车辆状态
        setCurrentVehicle(suv);
        setVehicle(suv);
        notifier.success("已切换为SUV");
      };
      img.onerror = () => {
        notifier.error("无法加载SUV图片");
      };
    } catch (error) {
      console.error("切换SUV时出错:", error);
      notifier.error("切换SUV失败");
    }
  };

  // 判断当前车型
  const isSedan = currentVehicle instanceof SedanVehicle;
  const isSuv = currentVehicle instanceof SuvVehicle;

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
      {/* 车辆控制面板 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          车辆控制
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* 这里可以添加其他车辆控制功能，如位置调整、旋转等 */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {vehicle ? "当前已添加车辆到场景中" : "尚未添加车辆到场景中"}
        </Typography>
      </Box>

      {/* 车型切换部分 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          车型切换
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box display="flex" flexWrap="wrap" justifyContent="center">
          <Box sx={{ m: 1 }}>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">切换为轿车</Typography>
                </React.Fragment>
              }
            >
              <Paper
                elevation={isSedan ? 3 : 1}
                sx={{
                  borderRadius: 2,
                  border: isSedan
                    ? `2px solid ${theme.palette.primary.main}`
                    : "none",
                }}
              >
                <IconButton
                  onClick={handleSwitchToSedan}
                  sx={{
                    width: 80,
                    height: 80,
                    flexDirection: "column",
                    backgroundColor: isSedan
                      ? "rgba(0, 0, 0, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.12)",
                    },
                    borderRadius: 2,
                  }}
                >
                  <DirectionsCarIcon
                    sx={{
                      fontSize: 40,
                      mb: 1,
                      color: isSedan ? theme.palette.primary.main : "inherit",
                    }}
                  />
                  <Typography
                    variant="caption"
                    color={isSedan ? "primary" : "inherit"}
                  >
                    轿车
                  </Typography>
                </IconButton>
              </Paper>
            </HtmlTooltip>
          </Box>

          <Box sx={{ m: 1 }}>
            <HtmlTooltip
              title={
                <React.Fragment>
                  <Typography color="inherit">切换为SUV</Typography>
                </React.Fragment>
              }
            >
              <Paper
                elevation={isSuv ? 3 : 1}
                sx={{
                  borderRadius: 2,
                  border: isSuv
                    ? `2px solid ${theme.palette.primary.main}`
                    : "none",
                }}
              >
                <IconButton
                  onClick={handleSwitchToSuv}
                  sx={{
                    width: 80,
                    height: 80,
                    flexDirection: "column",
                    backgroundColor: isSuv
                      ? "rgba(0, 0, 0, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.12)",
                    },
                    borderRadius: 2,
                  }}
                >
                  <AirportShuttleIcon
                    sx={{
                      fontSize: 40,
                      mb: 1,
                      color: isSuv ? theme.palette.primary.main : "inherit",
                    }}
                  />
                  <Typography
                    variant="caption"
                    color={isSuv ? "primary" : "inherit"}
                  >
                    SUV
                  </Typography>
                </IconButton>
              </Paper>
            </HtmlTooltip>
          </Box>
        </Box>
      </Box>

      {/* 车辆参数部分 - 可以在这里添加更多车辆相关的设置 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          车辆参数
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* 这里可以添加车辆参数设置，如尺寸、颜色等 */}
        <Typography variant="body2" color="text.secondary" align="center">
          {vehicle ? "可以在这里添加车辆参数设置" : "请先选择一个车型"}
        </Typography>
      </Box>
    </Box>
  );
};

export default VehiclePanel;
