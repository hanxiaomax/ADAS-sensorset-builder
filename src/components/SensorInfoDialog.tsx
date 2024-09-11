import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CardMedia,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  TextField,
  Tooltip,
} from "@mui/material";
import { Sensor, SensorConfig, SensorItem, SensorSpec } from "../types/Common";

interface SensorInfoDialogProps {
  open: boolean;
  icon: React.ReactElement;
  onClose: () => void;
  onInstall: () => void;
  onRemove: () => void;
  onEdit: (editedSensor: SensorItem) => void;
  sensor: SensorItem;
}

const SensorInfoDialog: React.FC<SensorInfoDialogProps> = ({
  open,
  onClose,
  onInstall,
  onRemove,
  onEdit,
  sensor,
  icon,
}) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editedSpecs, setEditedSpecs] = useState<SensorSpec | undefined>(
    sensor.spec
  );
  const [showTooltip, setShowTooltip] = useState<string | null>(null); // 控制工具提示的显示

  const dialogRef = useRef<HTMLDivElement | null>(null);

  // 保存更改并退出编辑模式
  const saveChanges = () => {
    if (editedSpecs && editingCell !== null) {
      const editedSensor = {
        ...sensor,
        spec: editedSpecs,
      };
      onEdit(editedSensor);
    }
    setEditingCell(null);
    setShowTooltip(null); // 退出编辑模式时允许工具提示显示
  };

  const handleDoubleClick = (key: string) => {
    setEditingCell(key);
    setShowTooltip(null); // 编辑模式下隐藏工具提示
  };

  const handleInputChange = (key: string, value: string) => {
    if (editedSpecs) {
      setEditedSpecs({
        ...editedSpecs,
        [key]: value,
      });
    }
  };

  const handleInputBlur = () => {
    saveChanges();
  };

  // 单击或点击其他位置时保存并退出编辑模式
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dialogRef.current &&
      !dialogRef.current.contains(event.target as Node) &&
      editingCell !== null
    ) {
      saveChanges();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <Dialog open={open} onClose={onClose} ref={dialogRef}>
      <DialogTitle>{sensor.name}</DialogTitle>
      <DialogContent>
        {sensor.image ? (
          <CardMedia
            component="img"
            height="140"
            image={sensor.image}
            alt={sensor.name}
            sx={{ objectFit: "contain", marginBottom: "16px" }}
          />
        ) : (
          <Box
            sx={{
              height: "140px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              marginBottom: "16px",
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {sensor.desc}
        </Typography>
        {editedSpecs && (
          <Table size="small" aria-label="sensor specs">
            <TableBody>
              {Object.entries(editedSpecs).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {key}
                  </TableCell>
                  <Tooltip
                    title="Double-click to edit"
                    arrow
                    placement="top-end"
                    open={showTooltip === key && editingCell === null}
                  >
                    <TableCell
                      onDoubleClick={() => handleDoubleClick(key)}
                      onMouseEnter={() => setShowTooltip(key)}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      {editingCell === key ? (
                        <TextField
                          value={value}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          onBlur={handleInputBlur}
                          autoFocus
                          size="small"
                          variant="standard"
                          fullWidth={false}
                          sx={{
                            width: "50px",
                            "& .MuiInputBase-root": {
                              height: "100%",
                            },
                            "& .MuiInputBase-input": {
                              padding: 0,
                              textAlign: "center",
                              color: "black",
                            },
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            display: "inline-block",
                            width: "50px",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          {value}
                        </span>
                      )}
                    </TableCell>
                  </Tooltip>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onInstall} color="primary">
          Install
        </Button>
        <Button onClick={onRemove} color="secondary">
          Remove
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SensorInfoDialog;
