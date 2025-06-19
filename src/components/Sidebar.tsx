import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Toolbar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Gavel,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onMenuItemClick: (item: string) => void;
  selectedItem: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'ba', label: 'Business Applications', icon: BusinessIcon },
  { id: 'approvals', label: 'Approvals', icon: Gavel },
];

const Sidebar: React.FC<SidebarProps> = ({
  onMenuItemClick,
  selectedItem,
}) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          marginTop: '65px'
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }} >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Developer Tools
          </Typography>
        </Box>
        
        <Divider />
        
        <List>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={selectedItem === item.id}
                  onClick={() => onMenuItemClick(item.id)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 