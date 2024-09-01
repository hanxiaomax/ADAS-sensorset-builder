import React, { useState } from "react";
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
import { SensorConfig, SensorSpec } from "../types/Common";

interface SensorInfoDialogProps {
  open: boolean;
  icon: React.ReactElement;
  onClose: () => void;
  onInstall: () => void;
  onRemove: () => void;
  onEdit: (editedSensor: SensorConfig) => void;
  sensor: SensorConfig;
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
  const [editingCell, setEditingCell] = useState<string | null>(null); // 当前正在编辑的单元格
  const [editedSpecs, setEditedSpecs] = useState<SensorSpec | undefined>(
    sensor.spec
  );

  const handleCellClick = (key: string) => {
    setEditingCell(key);
  };

  const handleInputChange = (key: string, value: string) => {
    if (editedSpecs) {
      setEditedSpecs({
        ...editedSpecs,
        [key]: value,
      });
    }
    console.log(editedSpecs);
  };

  const handleInputBlur = () => {
    if (editedSpecs) {
      const editedSensor = {
        ...sensor,
        spec: editedSpecs,
      };
      onEdit(editedSensor);
    }
    setEditingCell(null); // 取消编辑状态
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{sensor.profile.name}</DialogTitle>
      <DialogContent>
        {sensor.profile.image ? (
          <CardMedia
            component="img"
            height="140"
            image={sensor.profile.image}
            alt={sensor.profile.name}
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
          {sensor.profile.desc}
        </Typography>
        {editedSpecs && (
          <Table size="small" aria-label="sensor specs">
            <TableBody>
              {Object.entries(editedSpecs).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {key}
                  </TableCell>
                  <Tooltip title="Click to edit" arrow>
                    <TableCell onClick={() => handleCellClick(key)}>
                      {editingCell === key ? (
                        <TextField
                          value={value}
                          onChange={(e) =>
                            handleInputChange(key, e.target.value)
                          }
                          onBlur={handleInputBlur}
                          autoFocus
                          size="small"
                          InputProps={{
                            style: { textAlign: "center" }, // 文字居中
                          }}
                        />
                      ) : (
                        value
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
