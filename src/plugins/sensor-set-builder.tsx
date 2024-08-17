import React, { useState } from "react";
import { Grid, TextField, Box } from "@mui/material";
import UssZones from "../components/UssZones";

const SensorSetBuilderMain: React.FC = () => {
  const [frontZones, setFrontZones] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [rearZones, setRearZones] = useState<number[]>([1, 2, 3, 4]);
  const [sideZones, setsideZones] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const handleZoneChange = (
    setter: React.Dispatch<React.SetStateAction<number[]>>,
    count: number
  ) => {
    setter(Array.from({ length: count }, (_, index) => index));
  };

  return (
    <Grid
      container
      spacing={2}
      style={{ height: "100vh", alignItems: "center" }}
    >
      <Grid item xs={2}></Grid>
      {/* 左侧车辆显示区域 */}
      <Grid item xs={6}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: "rotate(270deg)", // 旋转容器90度
          }}
        >
          <UssZones
            width={400}
            height={800}
            frontZones={frontZones}
            rearZones={rearZones}
            sideZones={sideZones}
            carImageSrc="/vehicle.png"
          />
        </Box>
      </Grid>

      {/* 右侧控制输入框 */}
      <Grid item xs={4}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start" // 让输入框靠近顶部
          alignItems="center"
          height="100%"
          padding={2}
        >
          <TextField
            label="Front Zones Numbers"
            type="number"
            variant="outlined"
            value={frontZones.length}
            onChange={(e) =>
              handleZoneChange(setFrontZones, parseInt(e.target.value))
            }
            margin="normal"
            style={{ maxWidth: "300px" }} // 控制输入框长度
          />
          <TextField
            label="Side Zone Numbers"
            type="number"
            variant="outlined"
            value={sideZones.length}
            onChange={(e) =>
              handleZoneChange(setsideZones, parseInt(e.target.value))
            }
            margin="normal"
            style={{ maxWidth: "300px" }} // 控制输入框长度
          />
          <TextField
            label="Rear Zones Numbers"
            type="number"
            variant="outlined"
            value={rearZones.length}
            onChange={(e) =>
              handleZoneChange(setRearZones, parseInt(e.target.value))
            }
            margin="normal"
            style={{ maxWidth: "300px" }} // 控制输入框长度
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default SensorSetBuilderMain;
