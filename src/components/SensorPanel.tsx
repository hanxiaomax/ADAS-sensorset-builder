import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Collapse,
  IconButton,
  Grid,
  Drawer,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { SensorConfig, SensorState } from "../types/Common";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowForwardIosOutlined, TableRows } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material";

interface SensorPanelProps {
  sensorConfiguration: SensorConfig[];
  setSensorConfiguration: React.Dispatch<React.SetStateAction<SensorConfig[]>>;
  onSelectSensor: (index: number | null) => void;
}

const SensorPanel: React.FC<SensorPanelProps> = ({
  sensorConfiguration,
  setSensorConfiguration,
  onSelectSensor,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleExpandClick = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      onSelectSensor(null);
    } else {
      setExpandedIndex(index);
      onSelectSensor(index);
    }
  };

  const handleDeleteClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedConfig = [...sensorConfiguration];
    updatedConfig.splice(index, 1);
    setSensorConfiguration(updatedConfig);
    localStorage.setItem("sensorConfig", JSON.stringify(updatedConfig));

    if (expandedIndex === index) {
      setExpandedIndex(null);
      onSelectSensor(null);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMarkerChange = (
    index: number,
    event: SelectChangeEvent<SensorState>
  ) => {
    const updatedConfig = [...sensorConfiguration];
    updatedConfig[index] = {
      ...updatedConfig[index],
      state: event.target.value as SensorState,
    };
    setSensorConfiguration(updatedConfig);
    localStorage.setItem("sensorConfig", JSON.stringify(updatedConfig));
  };

  const sensorStateLabels: { [key in SensorState]: string } = {
    [SensorState.NORMAL]: "NORMAL",
    [SensorState.BROKEN]: "BROKEN",
    [SensorState.HIDE]: "HIDE",
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          color: "#0c7a92",
          top: 0,
          right: 0,
          fontSize: "40px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
        }}
      >
        {drawerOpen ? (
          <ArrowForwardIosOutlined sx={{ fontSize: "40px", color: "white" }} />
        ) : (
          <TableRows sx={{ fontSize: "40px" }} />
        )}
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{ zIndex: 1200 }}
        variant="persistent"
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
            }}
          >
            <Typography variant="h6">Sensor Set</Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              overflowY: "auto",
              padding: "10px",
              flexGrow: 1,
            }}
          >
            {sensorConfiguration.map((sensor, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  padding: "10px",
                  marginBottom: "10px",
                  backgroundColor:
                    expandedIndex === index ? "#f8f7f7" : "#ffffff",
                  border:
                    expandedIndex === index ? "3px solid #0698b4" : "none",
                  cursor: "pointer",
                }}
                onClick={() => handleExpandClick(index)}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar
                      src={sensor.profile.image || undefined}
                      alt={sensor.profile.name}
                      sx={{
                        width: 30,
                        height: 30,
                        backgroundColor: "#e0e0e0",
                      }}
                    >
                      {!sensor.profile.image && sensor.profile.name![0]}
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1">
                      {sensor.profile.name}
                    </Typography>
                    <Typography variant="body2">
                      Position: {sensor.mountPosition!.name}
                    </Typography>
                  </Grid>
                </Grid>

                <Collapse
                  in={expandedIndex === index}
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid
                    container
                    alignItems="center"
                    spacing={2}
                    sx={{ height: "150px" }}
                  >
                    <Grid item xs>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          Age
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={sensor.state ?? SensorState.NORMAL}
                          onChange={(event) => handleMarkerChange(index, event)}
                          label="Age"
                        >
                          {Object.values(SensorState)
                            .filter((value) => typeof value === "number")
                            .map((value) => (
                              <MenuItem
                                key={value}
                                value={value}
                                sx={{ fontSize: "14px" }}
                              >
                                {sensorStateLabels[value as SensorState]}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <IconButton
                        onClick={(event) => handleDeleteClick(index, event)}
                        size="small"
                        sx={{
                          backgroundColor: "#fefeff",
                          color: "#000",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Collapse>
              </Paper>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SensorPanel;
