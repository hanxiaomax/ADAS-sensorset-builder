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
} from "@mui/material";
import { SensorSpec } from "../types/Common";

interface SensorInfoDialogProps {
  open: boolean;
  name: string;
  description: string;
  specs?: SensorSpec;
  image?: string;
  icon: React.ReactElement;
  onClose: () => void;
  onInstall: () => void;
  onRemove: () => void;
}

const SensorInfoDialog: React.FC<SensorInfoDialogProps> = ({
  open,
  onClose,
  onInstall,
  onRemove,
  name,
  description,
  specs,
  image,
  icon,
}) => {
  const [editingCell, setEditingCell] = useState<string | null>(null); // 当前正在编辑的单元格
  const [editedSpecs, setEditedSpecs] = useState<SensorSpec | undefined>(specs);

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
  };

  const handleInputBlur = () => {
    setEditingCell(null);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{name}</DialogTitle>
      <DialogContent>
        {image ? (
          <CardMedia
            component="img"
            height="140"
            image={image}
            alt={name}
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
          {description}
        </Typography>
        {editedSpecs && (
          <Table size="small" aria-label="sensor specs">
            <TableBody>
              {Object.entries(editedSpecs).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">
                    {key}
                  </TableCell>
                  <TableCell onClick={() => handleCellClick(key)}>
                    {editingCell === key ? (
                      <TextField
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        onBlur={handleInputBlur}
                        autoFocus
                        size="small"
                      />
                    ) : (
                      value
                    )}
                  </TableCell>
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
