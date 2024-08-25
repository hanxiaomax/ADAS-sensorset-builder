import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";

interface ProfileMenuProps {
  onImport: () => void;
  onExport: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onImport, onExport }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
      >
        Profile
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={onImport}>Import</MenuItem>
        <MenuItem onClick={onExport}>Export</MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
