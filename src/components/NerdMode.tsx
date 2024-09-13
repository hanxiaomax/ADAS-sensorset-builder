import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Typography } from "@mui/material";
import { Sensor, SensorStocks } from "../types/Common";

interface NerdModeProps {
  show: boolean;
  sensor_configuration: Sensor[];
  sensor_stocks: SensorStocks | undefined;
}

const NerdMode: React.FC<NerdModeProps> = ({
  show,
  sensor_configuration,
  sensor_stocks,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 200,
        right: 0,
        width: "20vw",
        height: "95vh",
        padding: "5px",
        overflowY: "auto",
        zIndex: 1500,
      }}
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography sx={{ fontSize: "0.875rem" }}>
            Sensor Configuration
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {sensor_configuration && sensor_configuration.length > 0 ? (
            <Typography
              gutterBottom
              sx={{
                fontSize: "0.7rem",
                color: "black",
              }}
            >
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(sensor_configuration, null, 2)}
              </pre>
            </Typography>
          ) : (
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "gray",
              }}
            >
              Please import sensor configuration data
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography sx={{ fontSize: "0.875rem" }}>Sensor Stocks</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {sensor_stocks && Object.keys(sensor_stocks).length > 0 ? (
            <Typography
              gutterBottom
              sx={{
                fontSize: "0.7rem",
                color: "black",
              }}
            >
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(sensor_stocks, null, 2)}
              </pre>
            </Typography>
          ) : (
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "gray",
              }}
            >
              Please import sensor stock data
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default NerdMode;
