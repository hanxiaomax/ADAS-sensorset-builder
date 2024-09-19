import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Grid,
  Drawer,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Pagination,
} from "@mui/material";
import Sensor from "../types/Sensor";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ArrowForwardIosOutlined,
  FilterList,
  GetAppTwoTone,
  ShareTwoTone,
  TableViewTwoTone,
} from "@mui/icons-material";
import HighlightIcon from "@mui/icons-material/Highlight";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Sensors from "@mui/icons-material/Sensors";
import { BomTableDialog } from "./Dialogs/BomTableDialog";

interface SensorPanelProps {
  sensors: Sensor[];
  setSensors: React.Dispatch<React.SetStateAction<Sensor[]>>;
}

const SensorPanel: React.FC<SensorPanelProps> = ({ sensors, setSensors }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bomTableDialogOpen, setBomTableDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // 用于控制筛选菜单的显示
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // 记录当前筛选的类型
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const [itemsPerPage, setItemsPerPage] = useState(5); // 每页显示的项目数
  const paperHeight = 90; // 每个 Paper 项目的高度（包括 margin 和 padding）

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const availableHeight = windowHeight - 200; // 减去顶部菜单、分页等的高度
      const newItemsPerPage = Math.floor(availableHeight / paperHeight); // 计算每页能显示多少项
      setItemsPerPage(newItemsPerPage);
    };

    // 初始化时计算 itemsPerPage
    handleResize();

    // 监听窗口大小变化
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 切换 Drawer 显示/隐藏状态
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // 处理 ToggleButton 的变化
  const handleToggleChange = (
    id: string,
    event: React.MouseEvent<HTMLElement>,
    newOptions: string[] | null
  ) => {
    const updatedConfig = sensors.map((sensor) => {
      if (sensor.id === id) {
        return {
          ...sensor,
          options: newOptions || [], // 直接替换 options
        };
      } else {
        return sensor;
      }
    });

    setSensors(updatedConfig); // 确保状态被更新并触发重新渲染
    localStorage.setItem("sensorConfig", JSON.stringify(updatedConfig));
  };

  // 删除操作
  const handleDeleteClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedConfig = sensors.filter((sensor) => sensor.id !== id);
    setSensors(updatedConfig);
    localStorage.setItem("sensorConfig", JSON.stringify(updatedConfig));
  };

  // 打开筛选菜单
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 关闭筛选菜单
  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // 打开spec对话框
  const handleDataTableClick = () => {
    setBomTableDialogOpen(true);
  };

  // 处理多选
  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type)); // 取消选中
    } else {
      setSelectedTypes([...selectedTypes, type]); // 添加选中
    }
  };

  // 筛选传感器
  const filteredSensors = selectedTypes.length
    ? sensors.filter((sensor) => selectedTypes.includes(sensor.sensorInfo.type))
    : sensors; // 如果未选中任何类型，显示所有传感器

  // 计算当前页显示的传感器
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSensors = filteredSensors.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // 处理分页变化
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* 确保 IconButton 的 z-index 比较高，避免被其他元素遮盖 */}
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          color: "#0c7a92",
          top: 50,
          right: 0,
          fontSize: "40px",
          zIndex: 1400, // 确保图标显示在最前面
        }}
      >
        {!drawerOpen && <Sensors sx={{ fontSize: "40px" }} />}
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        variant="persistent"
        PaperProps={{ sx: { overflow: "visible" } }}
      >
        <Box
          sx={{
            width: "20vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              padding: "10px",
              backgroundColor: "#0c7a92",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Sensor Set</Typography>

            <IconButton
              onClick={toggleDrawer}
              sx={{
                position: "fixed",
                color: "#0c7a92",
                top: 0,
                right: 0,
                fontSize: "40px",
                zIndex: 1400, // 确保图标显示在最前面
              }}
            >
              <ArrowForwardIosOutlined
                sx={{ fontSize: "40px", color: "white" }}
              />
            </IconButton>
          </Box>

          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTypes.includes("uss")}
                    onChange={() => handleTypeChange("uss")}
                  />
                }
                label="USS"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTypes.includes("lidar")}
                    onChange={() => handleTypeChange("lidar")}
                  />
                }
                label="Lidar"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTypes.includes("camera")}
                    onChange={() => handleTypeChange("camera")}
                  />
                }
                label="Camera"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTypes.includes("radar")}
                    onChange={() => handleTypeChange("radar")}
                  />
                }
                label="Radar"
              />
            </MenuItem>
          </Menu>

          <Divider />

          <Box
            sx={{
              flexGrow: 1,
              paddingRight: "10px",
              paddingLeft: "10px",
              position: "relative", // 确保卡片能够相对移动
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end", // 将内容靠右对齐
                alignItems: "center", // 垂直居中对齐
              }}
            >
              <IconButton
                aria-controls="Export-menu"
                aria-haspopup="true"
                onClick={() => {}}
              >
                <GetAppTwoTone />
              </IconButton>
              <IconButton
                aria-controls="bom-menu"
                aria-haspopup="true"
                onClick={handleDataTableClick}
              >
                <TableViewTwoTone />
              </IconButton>
              <IconButton
                aria-controls="share-menu"
                aria-haspopup="true"
                onClick={() => {}}
              >
                <ShareTwoTone />
              </IconButton>
              <IconButton
                aria-controls="filter-menu"
                aria-haspopup="true"
                onClick={handleFilterClick}
              >
                <FilterList />
              </IconButton>
            </Box>

            {currentSensors.map((sensor) => (
              <Box
                key={sensor.id} // 使用 uuid 作为 key
                sx={{
                  position: "relative",
                  display: "block", // 确保卡片独占一行
                  overflow: "visible", // 确保悬停时内容可以溢出
                  transition: "margin-left 0.3s ease", // 使用 margin-left 代替 translateX
                  marginLeft: "0px", // 默认位置
                  "&:hover": {
                    marginLeft: "-20px", // 悬停时向左移动
                  },
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: "5px",
                    height: "80px",
                    marginBottom: "5px",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "40px 0px 0px 40px", // 左侧大圆角，右侧直角
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      height: "100%",
                      borderRadius: "50%", // 确保为圆形区域
                    }}
                  >
                    <Avatar
                      src={sensor.sensorInfo.image || undefined}
                      alt={sensor.sensorInfo.name}
                      sx={{
                        width: 40,
                        height: 40,
                      }}
                    >
                      {!sensor.sensorInfo.image && sensor.sensorInfo.name![0]}
                    </Avatar>
                  </Box>

                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs sx={{ m: "4px" }}>
                      <Typography variant="h1" sx={{ fontSize: "18px" }}>
                        {sensor.sensorInfo.name}
                      </Typography>
                      {/* <PinDrop /> */}
                      <Typography variant="body2" sx={{ fontSize: "12px" }}>
                        {sensor.mountPosition!.name}
                      </Typography>
                    </Grid>
                  </Grid>

                  <IconButton
                    onClick={(event) => handleDeleteClick(sensor.id, event)} // 使用 uuid
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "#097c74",
                      color: "white",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      width: 30,
                      height: 30,
                      "&:hover": {
                        backgroundColor: "#ff1744",
                        color: "white",
                      },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: "16px" }} />
                  </IconButton>

                  {/* 右下角的 ToggleButtonGroup 保留 */}
                  <Box
                    sx={{
                      position: "absolute",
                      right: 10,
                      bottom: 10,
                      display: "flex",
                      justifyContent: "right",
                    }}
                  >
                    <ToggleButtonGroup
                      value={sensor.options || []}
                      onChange={
                        (event, newOptions) =>
                          handleToggleChange(sensor.id, event, newOptions) // 使用 uuid
                      }
                      aria-label="sensor options"
                      size="small"
                      exclusive={false} // 允许多选
                    >
                      <ToggleButton
                        value="highlight"
                        aria-label="highlight"
                        sx={{
                          width: 22,
                          height: 22,
                          "&.Mui-selected": {
                            backgroundColor: "#efefef", // 激活时的背景色
                            color: "black", // 激活时的文字颜色
                          },
                        }}
                      >
                        <HighlightIcon sx={{ fontSize: "16px" }} />
                      </ToggleButton>

                      <ToggleButton
                        value="hide"
                        aria-label="hide"
                        sx={{
                          width: 22,
                          height: 22,
                          "&.Mui-selected": {
                            backgroundColor: "#efefef", // 激活时的背景色
                            color: "black", // 激活时的文字颜色
                          },
                        }}
                      >
                        <VisibilityOffIcon sx={{ fontSize: "16px" }} />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>

          {/* 添加分页 */}
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(filteredSensors.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              sx={{
                "& .MuiPaginationItem-root": {
                  margin: "0 1px", // 调整页码按钮的左右间距，使它们更加紧凑
                  padding: "2px 3px", // 调整按钮内部的填充
                },
                "& .Mui-selected": {
                  backgroundColor: "#0c7a92", // 选中页码按钮的背景颜色
                  color: "white", // 选中页码按钮的文字颜色
                },
              }}
            />
          </Box>
        </Box>
      </Drawer>
      <BomTableDialog
        open={bomTableDialogOpen}
        setBomTableDialogOpen={setBomTableDialogOpen}
        sensors={sensors}
      />
    </>
  );
};

export default SensorPanel;
