import React from 'react';
import { Box } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  idPrefix?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, idPrefix = 'tabpanel', ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${idPrefix}-${index}`}
      aria-labelledby={`${idPrefix}-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export function a11yProps(index: number, idPrefix = 'tabpanel') {
  return {
    id: `${idPrefix}-tab-${index}`,
    'aria-controls': `${idPrefix}-${index}`,
  };
}

export default TabPanel;
