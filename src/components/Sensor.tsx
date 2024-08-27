import React, { useState } from "react";
import {
  Box,
  Badge,
  Chip,
  ButtonGroup,
  Button,
  Popover,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import InstallConfigDialog from "./InstallConfigDialog"; // 引入 InstallConfigDialog 组件
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface SensorProps {
  icon: React.ReactElement;
  name: string;
  isNew?: boolean;
  description: string;
  specs?: { [key: string]: string };
  image?: string; // 添加 image 字段，用于传递图片链接
  onDelete?: (name: string) => void; // 添加删除处理函数
}

const Sensor: React.FC<SensorProps> = ({
  icon,
  name,
  isNew,
  description,
  specs,
  image,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hover, setHover] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // 删除确认弹窗状态

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

  const handleSave = (selectedPosition: string) => {
    console.log("Selected Position:", selectedPosition);
    // 在这里处理保存逻辑
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(name);
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

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
            backgroundColor: hover ? "#f6f6f6" : "transparent",
            width: "90px",
            height: "30px",
            color: "#111111",
            border: 0,
            boxShadow: "none",
            textTransform: "none",
            display: hover ? "block" : "none",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          },
        }}
      >
        <Button onClick={handleInstallClick}>Install</Button>
        <Button onClick={handleDeleteClick}>remove</Button>
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
              image={image}
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

      {/* Install Config Dialog */}
      <InstallConfigDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSave}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        sensorName={name}
      />
    </Box>
  );
};

export default Sensor;
