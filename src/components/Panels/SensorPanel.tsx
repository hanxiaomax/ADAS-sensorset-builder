import React, { useState, useEffect } from "react";
import { useSensorStore } from "../../stores/sensorStore";
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
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  FilterList,
  GetAppTwoTone,
  ShareTwoTone,
  TableViewTwoTone,
} from "@mui/icons-material";
import HighlightIcon from "@mui/icons-material/Highlight";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { BomTableDialog } from "../Dialogs/BomTableDialog";

interface SensorPanelProps {
  drawerOpen?: boolean;
}

const SensorPanel: React.FC<SensorPanelProps> = ({ drawerOpen }) => {
  const { sensorConfiguration, setSensorConfiguration } = useSensorStore();
  const [bomTableDialogOpen, setBomTableDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For controlling filter menu display
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Track currently filtered types
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page
  const paperHeight = 90; // Height of each Paper item (including margin and padding)

  const windowHeight = window.innerHeight;
  const availableHeight = windowHeight - 200; // Subtract height for top menu, pagination, etc.
  const newItemsPerPage = Math.floor(availableHeight / paperHeight); // Calculate how many items can be displayed per page

  useEffect(() => {
    // Initialize itemsPerPage
    setItemsPerPage(newItemsPerPage);

    // Listen for window resize
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const availableHeight = windowHeight - 200;
      const newItemsPerPage = Math.floor(availableHeight / paperHeight);
      setItemsPerPage(newItemsPerPage);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle ToggleButton changes
  const handleToggleChange = (
    sensorId: string,
    event: React.MouseEvent<HTMLElement>,
    newOptions: string[]
  ) => {
    event.stopPropagation();
    const updatedConfig = sensorConfiguration.map((sensor) => {
      if (sensor.id === sensorId) {
        return {
          ...sensor,
          options: newOptions || [],
        };
      }
      return sensor;
    });
    setSensorConfiguration(updatedConfig);
  };

  // Handle delete operation
  const handleDeleteClick = (sensorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedConfig = sensorConfiguration.filter(
      (sensor) => sensor.id !== sensorId
    );
    setSensorConfiguration(updatedConfig);
  };

  // Open filter menu
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close filter menu
  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // Open spec dialog
  const handleDataTableClick = () => {
    setBomTableDialogOpen(true);
  };

  // Handle multiple selection
  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type)); // Deselect
    } else {
      setSelectedTypes([...selectedTypes, type]); // Add selection
    }
  };

  // Filter sensors
  const filteredSensors = selectedTypes.length
    ? sensorConfiguration.filter((sensor) =>
        selectedTypes.includes(sensor.sensorInfo.type)
      )
    : sensorConfiguration;

  // Calculate sensors for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSensors = filteredSensors.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle pagination changes
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Installed Sensors</Typography>
        <Box>
          <IconButton
            onClick={handleFilterClick}
            sx={{
              mr: 1,
            }}
          >
            <FilterList />
          </IconButton>
          <IconButton onClick={handleDataTableClick}>
            <TableViewTwoTone />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
      >
        {Array.from(
          new Set(sensorConfiguration.map((sensor) => sensor.sensorInfo.type))
        ).map((type) => (
          <MenuItem
            key={type}
            onClick={() => handleTypeChange(type)}
            sx={{
              backgroundColor: selectedTypes.includes(type)
                ? "rgba(0, 0, 0, 0.04)"
                : "transparent",
            }}
          >
            <Checkbox checked={selectedTypes.includes(type)} />
            <ListItemText primary={type} />
          </MenuItem>
        ))}
      </Menu>

      <Box sx={{ position: "relative" }}>
        {filteredSensors
          .slice(indexOfFirstItem, indexOfLastItem)
          .map((sensor) => (
            <Paper
              key={sensor.id}
              elevation={3}
              sx={{
                p: 2,
                mb: 2,
                display: "block", // Ensure card takes full width
                overflow: "visible", // Allow content to overflow on hover
                transition: "margin-left 0.3s ease", // Use margin-left for animation
                marginLeft: "0px", // Default position
                "&:hover": {
                  marginLeft: "-20px", // Move left on hover
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#0c7a92",
                      borderRadius: "40px 0px 0px 40px", // Rounded left side, square right side
                      mr: 2,
                    }}
                  >
                    {sensor.sensorInfo.name?.charAt(0).toUpperCase() || ""}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {sensor.sensorInfo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sensor.mountPosition?.name}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    size="small"
                    sx={{
                      mr: 1,
                      borderRadius: "50%", // Ensure circular shape
                    }}
                    onClick={(event) => handleDeleteClick(sensor.id, event)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <ToggleButtonGroup
                    value={sensor.options || []}
                    onChange={(event, newOptions) =>
                      handleToggleChange(sensor.id, event, newOptions)
                    }
                    aria-label="sensor options"
                    size="small"
                    exclusive={false} // Allow multiple selection
                  >
                    <ToggleButton
                      value="highlight"
                      aria-label="highlight"
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#efefef", // Background color when active
                          color: "black", // Text color when active
                        },
                      }}
                    >
                      <HighlightIcon />
                    </ToggleButton>
                    <ToggleButton
                      value="hide"
                      aria-label="hide"
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#efefef", // Background color when active
                          color: "black", // Text color when active
                        },
                      }}
                    >
                      <VisibilityOffIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
            </Paper>
          ))}
      </Box>

      <Pagination
        count={Math.ceil(filteredSensors.length / itemsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          "& .MuiPaginationItem-root": {
            margin: "0 1px", // Adjust left and right margin for pagination buttons
            padding: "2px 3px", // Adjust internal padding
          },
          "& .Mui-selected": {
            backgroundColor: "#0c7a92", // Background color for selected page button
            color: "white", // Text color for selected page button
          },
        }}
      />

      <BomTableDialog
        open={bomTableDialogOpen}
        setBomTableDialogOpen={setBomTableDialogOpen}
        sensors={sensorConfiguration}
      />
    </Box>
  );
};

export default SensorPanel;
