import * as React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
} from "@mui/material";
import Sensor from "../types/Sensor";
import { useState } from "react";

interface DataTableProps {
  sensorData: Sensor[]; // Pass sensor data
  setSelectedRows: (rows: Sensor[]) => void;
  enablePagination: boolean; // Control pagination
}

export const DataTable: React.FC<DataTableProps> = ({
  sensorData,
  setSelectedRows,
  enablePagination,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(sensorData.map((n) => n.id));
      setSelectedRows(sensorData); // Set all rows as selected
    } else {
      setSelected([]);
      setSelectedRows([]); // Clear selected rows
    }
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    // Pass selected row data to ToolMenu
    setSelectedRows(
      sensorData.filter((sensor) => newSelected.includes(sensor.id))
    );
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Determine whether to paginate based on enablePagination
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sensorData.length) : 0;

  // Determine visible rows based on pagination status
  const visibleRows = enablePagination
    ? sensorData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sensorData;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
            id="selectedTable"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < sensorData.length
                    }
                    checked={
                      sensorData.length > 0 &&
                      selected.length === sensorData.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    width: 150,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    width: 100,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    width: 100,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Range (m)
                </TableCell>
                <TableCell
                  sx={{
                    width: 100,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Fov (°)
                </TableCell>
                <TableCell
                  sx={{
                    width: 150,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Brand
                </TableCell>
                <TableCell
                  sx={{
                    width: 200,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Description
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((sensor) => {
                const isItemSelected = isSelected(sensor.id);
                const labelId = `enhanced-table-checkbox-${sensor.id}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, sensor.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={sensor.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {sensor.sensorInfo.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {sensor.sensorInfo.type}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {sensor.sensorInfo.spec.range}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {sensor.sensorInfo.spec.fov}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {sensor.sensorInfo.brand}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {sensor.sensorInfo.desc}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Show pagination component only when pagination is enabled */}
        {enablePagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sensorData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  );
};
