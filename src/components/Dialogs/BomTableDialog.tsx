import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DataTable } from "../DataTable";
import Sensor from "../../types/Sensor";

interface BomTableDialogProp {
  open: boolean;
  setBomTableDialogOpen: (value: React.SetStateAction<boolean>) => void;
  sensors: Sensor[];
}
export const BomTableDialog: React.FC<BomTableDialogProp> = ({
  open,
  setBomTableDialogOpen,
  sensors,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setBomTableDialogOpen(false);
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Sensor BOM</DialogTitle>
      <DialogContent>
        {/* Pass sensor data to DataTable */}
        <DataTable
          sensorData={sensors}
          setSelectedRows={() => {}}
          enablePagination={false}
        />
      </DialogContent>
      <DialogActions>
        {/* Button for generating table image */}
        {/* <Button onClick={() => {}} variant="contained" color="primary">
          Generate Selected Table Image
        </Button> */}
        <Button
          onClick={() => {
            setBomTableDialogOpen(false);
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
