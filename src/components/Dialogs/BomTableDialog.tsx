import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DataTable from "../DataTable";
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
        {/* 将选中的行通过setSelectedRows传递给DataTable */}
        <DataTable
          sensorData={sensors} // 传递 sensorConfig 数据
          setSelectedRows={() => {}}
          enablePagination={false}
        />
      </DialogContent>
      <DialogActions>
        {/* 生成图片的按钮 */}
        <Button onClick={() => {}} variant="contained" color="primary">
          Generate Selected Table Image
        </Button>
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
