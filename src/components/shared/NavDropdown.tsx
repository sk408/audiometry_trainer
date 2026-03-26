import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';

export interface NavChild {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export interface NavGroup {
  label: string;
  icon: React.ReactNode;
  basePath: string;
  children: NavChild[];
}

interface NavDropdownProps {
  group: NavGroup;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ group }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const isActive = location.pathname.startsWith(group.basePath);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleOpen}
        endIcon={<KeyboardArrowDown />}
        sx={{
          mx: 0.5,
          borderBottom: isActive ? '2px solid white' : '2px solid transparent',
          borderRadius: 0,
          pb: 0.5,
        }}
      >
        {group.label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {group.children.map((child) => (
          <MenuItem
            key={child.path}
            component={Link}
            to={child.path}
            onClick={handleClose}
            selected={location.pathname === child.path}
          >
            <ListItemIcon>{child.icon}</ListItemIcon>
            <ListItemText>{child.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NavDropdown;
