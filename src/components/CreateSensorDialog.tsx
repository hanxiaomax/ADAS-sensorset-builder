import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { SensorConfig, SensorState } from "../types/Common";

interface CreateSensorDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (sensor: SensorConfig) => void;
  existingTypes: string[]; // 传入现有的传感器类型
  defaultType: string; // 传入默认类型
}

const CreateSensorDialog: React.FC<CreateSensorDialogProps> = ({
  open,
  onClose,
  onCreate,
  existingTypes,
  defaultType,
}) => {
  console.log("defaultType:", defaultType);
  const [newSensor, setNewSensor] = useState<SensorConfig>({
    id: Date.now(),
    profile: {
      name: "",
      type: defaultType, // 使用传入的默认类型
      desc: "",
      image: "",
    },
    spec: {
      range: 0,
      fov: 0,
    },
    attr: {
      promotion: false,
      new: false,
    },
  });

  const [isOtherType, setIsOtherType] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewSensor((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value,
      },
    }));
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "Other") {
      setIsOtherType(true);
      setNewSensor((prev) => ({
        ...prev,
        profile: { ...prev.profile, type: "" }, // 将类型设为空字符串
      }));
    } else {
      setIsOtherType(false);
      setNewSensor((prev) => ({
        ...prev,
        profile: { ...prev.profile, type: value },
      }));
    }
  };

  const handleOtherTypeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewSensor((prev) => ({
      ...prev,
      profile: { ...prev.profile, type: value }, // 将类型更新为用户输入
    }));
  };

  const handleCreate = () => {
    onCreate(newSensor);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Sensor</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="name"
          label="Sensor Name"
          fullWidth
          variant="standard"
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="desc"
          label="Description"
          fullWidth
          variant="standard"
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="type"
          label="Type"
          select
          fullWidth
          variant="standard"
          value={defaultType} // 控制选择项的显示
          onChange={handleTypeChange}
        >
          {existingTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        {isOtherType && (
          <TextField
            margin="dense"
            name="type"
            label="Specify Type"
            fullWidth
            variant="standard"
            onChange={handleOtherTypeInput} // 使用独立的处理函数来更新类型
          />
        )}
        <TextField
          margin="dense"
          name="range"
          label="Range (m)"
          type="number"
          fullWidth
          variant="standard"
          onChange={(e) =>
            setNewSensor((prev) => ({
              ...prev,
              spec: { ...prev.spec, range: Number(e.target.value) },
            }))
          }
        />
        <TextField
          margin="dense"
          name="fov"
          label="Field of View (°)"
          type="number"
          fullWidth
          variant="standard"
          onChange={(e) =>
            setNewSensor((prev) => ({
              ...prev,
              spec: { ...prev.spec, fov: Number(e.target.value) },
            }))
          }
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCreate}
          variant="contained"
          sx={{ minWidth: 100, color: "white", backgroundColor: "#0c7a92" }}
        >
          Create
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSensorDialog;
