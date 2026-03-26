import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box, List, ListItem, ListItemIcon, ListItemText, Divider,
  Collapse, Typography,
} from '@mui/material';
import {
  ExpandLess, ExpandMore, Hearing as HearingIcon,
  Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon,
  Assessment as AssessmentIcon, Settings as SettingsIcon,
} from '@mui/icons-material';
import type { NavGroup } from './NavDropdown';

export type NavEntry = { label: string; icon: React.ReactNode; path: string } | NavGroup;

function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'children' in entry;
}

interface NavDrawerProps {
  navigation: NavEntry[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  onClose: () => void;
}

const NavDrawer: React.FC<NavDrawerProps> = ({ navigation, darkMode, toggleDarkMode, onClose }) => {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HearingIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Audiometry Trainer
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigation.map((entry) => {
          if (!isNavGroup(entry)) {
            return (
              <ListItem
                key={entry.label}
                component={Link}
                to={entry.path}
                onClick={onClose}
                sx={{
                  color: 'text.primary',
                  bgcolor: location.pathname === entry.path ? 'action.selected' : 'transparent',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <ListItemIcon>{entry.icon}</ListItemIcon>
                <ListItemText primary={entry.label} />
              </ListItem>
            );
          }

          const isGroupActive = location.pathname.startsWith(entry.basePath);
          const isOpen = openGroups[entry.label] ?? isGroupActive;

          return (
            <React.Fragment key={entry.label}>
              <ListItem
                onClick={() => toggleGroup(entry.label)}
                sx={{
                  cursor: 'pointer',
                  borderLeft: isGroupActive ? '3px solid' : '3px solid transparent',
                  borderColor: isGroupActive ? 'primary.main' : 'transparent',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <ListItemIcon>{entry.icon}</ListItemIcon>
                <ListItemText
                  primary={entry.label}
                  primaryTypographyProps={{ fontWeight: isGroupActive ? 'bold' : 'normal' }}
                />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {entry.children.map((child) => (
                    <ListItem
                      key={child.path}
                      component={Link}
                      to={child.path}
                      onClick={onClose}
                      sx={{
                        pl: 4,
                        color: 'text.primary',
                        bgcolor: location.pathname === child.path ? 'action.selected' : 'transparent',
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>{child.icon}</ListItemIcon>
                      <ListItemText primary={child.label} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem component={Link} to="/progress" onClick={onClose} sx={{ color: 'text.primary', '&:hover': { backgroundColor: 'action.hover' } }}>
          <ListItemIcon><AssessmentIcon /></ListItemIcon>
          <ListItemText primary="My Progress" />
        </ListItem>
        <ListItem component={Link} to="/settings" onClick={onClose} sx={{ color: 'text.primary', '&:hover': { backgroundColor: 'action.hover' } }}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem onClick={toggleDarkMode} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
          <ListItemIcon>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
        </ListItem>
      </List>
    </Box>
  );
};

export default NavDrawer;
