import React, { useState } from "react";
import {
  Box,
  Popover,
  Card,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CardMedia,
  styled,
} from "@mui/material";
import InstallConfigDialog from "./Dialogs/InstallConfigDialog";
import DeleteConfirmationDialog from "./Dialogs/DeleteConfirmationDialog";
import SensorInfoDialog from "./SensorInfoDialog";
import { SensorItem } from "../types/Common";
import Sensor from "../types/Sensor";
import { v4 as uuidv4 } from "uuid"; // 引入uuid库
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

interface SensorStockItemProps {
  icon: React.ReactElement;
  sensor: SensorItem;
  onDelete: (id: string) => void; // 添加删除处理函数，使用 sensor ID 进行删除
  setSensorConfiguration: React.Dispatch<React.SetStateAction<Sensor[]>>;
  onEdit: (editedSensor: SensorItem) => void;
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const SensorStockItem: React.FC<SensorStockItemProps> = ({
  icon,
  sensor,
  onDelete,
  onEdit,
  setSensorConfiguration,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hover, setHover] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // 删除确认弹窗状态
  const [sensorInfoOpen, setSensorInfoOpen] = useState(false);

  const handleSensorClick = () => {
    setSensorInfoOpen(true);
  };

  const handleSensorInfoClose = () => {
    setSensorInfoOpen(false);
  };

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleInstallClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleInstallConfirm = (
    selectedSensor: SensorItem,
    selectedPosition: string,
    orientation: number
  ) => {
    const sensorConfig = JSON.parse(
      localStorage.getItem("sensorConfig") || "[]"
    );
    const position = {
      name: selectedPosition,
    };
    const options = ["highlight"]; //highlight by default for new sesnor
    const newSensor = new Sensor(uuidv4(), selectedSensor, position, options);
    console.log(newSensor instanceof Sensor); // 应该返回 true
    sensorConfig.push(newSensor);
    setSensorConfiguration(sensorConfig);
    localStorage.setItem("sensorConfig", JSON.stringify(sensorConfig));
    setDialogOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(sensor.id); // 删除使用 sensor ID
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // marginRight: "4px",
          // margin: "8px",
          position: "relative",
          // boxShadow: 1,
          borderRadius: "60px",
          "&:hover": {
            boxShadow: 1,
            borderRadius: "60px",
          },
        }}
        onClick={handleSensorClick} // 点击时关闭 Popover
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography color="inherit">{sensor.name}</Typography>
                <Typography
                  fontStyle="italic"
                  sx={{ fontSize: "12px" }}
                  gutterBottom
                >
                  {sensor.desc}
                </Typography>

                <Box>
                  <Typography sx={{ fontSize: "13px" }}>
                    Brand: <u>{sensor.brand}</u>
                  </Typography>
                  <Typography sx={{ fontSize: "13px" }}>
                    Fov: <u>{sensor.spec.fov}</u>
                  </Typography>
                  <Typography sx={{ fontSize: "13px" }}>
                    Range: <u>{sensor.spec.range}</u>
                  </Typography>
                </Box>
              </React.Fragment>
            }
          >
            {icon}
          </HtmlTooltip>
        </Box>
      </Box>
      {/* Use 和 Delete 按钮，仅在悬停时显示 */}
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
            <Typography variant="subtitle1" component="span">
              {sensor.name}
            </Typography>
          </CardContent>
          {sensor.image ? (
            <CardMedia
              component="img"
              height="140"
              image={sensor.image}
              alt={sensor.name}
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
            {sensor.spec && (
              <Table size="small" aria-label="sensor specs">
                <TableBody>
                  {Object.entries(sensor.spec).map(([key, value]) => (
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
      {/* Install Config Dialog */}
      <InstallConfigDialog
        open={dialogOpen}
        sensorItem={sensor}
        onClose={handleDialogClose}
        onConfirm={handleInstallConfirm}
      />
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        sensorName={sensor.name}
      />
      {/* Sensor Info Dialog */}
      <SensorInfoDialog
        open={sensorInfoOpen}
        onClose={handleSensorInfoClose}
        onInstall={handleInstallClick}
        onRemove={handleDeleteClick}
        onEdit={onEdit}
        sensor={sensor}
        icon={icon}
      />{" "}
    </Box>
  );
};

export default SensorStockItem;
