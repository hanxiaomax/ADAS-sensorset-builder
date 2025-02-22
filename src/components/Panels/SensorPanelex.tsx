import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSceneStore } from "../../stores/sceneStore";
import { useSensorStore } from "../../stores/sensorStore";

interface SensorPanelExProps {}

const SensorPanelEx: React.FC<SensorPanelExProps> = () => {
  const { sensors, removeSensor } = useSceneStore();
  const { sensorConfiguration, setSensorConfiguration } = useSensorStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (sensorId: string) => {
    removeSensor(sensorId);

    const updatedConfig = sensorConfiguration.filter(
      (sensor) => sensor.id !== sensorId
    );
    setSensorConfiguration(updatedConfig);
  };

  return (
    <Box
      sx={{
        padding: 1,
        height: "360px",
        width: "580px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      {sensors.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 1 }}
        >
          No sensors installed yet
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 32px)",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              flexGrow: 1,
              minHeight: 0,
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f5f5f5",
                      py: 1,
                      fontSize: "0.875rem",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f5f5f5",
                      py: 1,
                      fontSize: "0.875rem",
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f5f5f5",
                      py: 1,
                      fontSize: "0.875rem",
                    }}
                  >
                    Position
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f5f5f5",
                      py: 1,
                      fontSize: "0.875rem",
                      width: "60px",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sensors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((sensor) => (
                    <TableRow
                      key={sensor.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f8f8f8",
                        },
                      }}
                    >
                      <TableCell sx={{ py: 0.5, fontSize: "0.875rem" }}>
                        {sensor.sensorInfo.name}
                      </TableCell>
                      <TableCell sx={{ py: 0.5, fontSize: "0.875rem" }}>
                        {sensor.sensorInfo.type}
                      </TableCell>
                      <TableCell sx={{ py: 0.5, fontSize: "0.875rem" }}>
                        {sensor.mountPosition.name}
                      </TableCell>
                      <TableCell align="right" sx={{ py: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(sensor.id)}
                          sx={{
                            padding: 0.5,
                            "&:hover": {
                              color: "error.main",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sensors.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              backgroundColor: "white",
              borderTop: "1px solid rgba(224, 224, 224, 1)",
              minHeight: "36px",
              ".MuiTablePagination-toolbar": {
                minHeight: "36px",
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  fontSize: "0.875rem",
                },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default SensorPanelEx;
