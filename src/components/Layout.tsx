import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import NavigationBar from './NavigationBar';
import Sidebar from './Sidebar';
import BusinessApplications from '../pages/BusinessApplications';
import Approvals from '../pages/Approvals';

// const DRAWER_WIDTH = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');

  const handleMenuItemClick = (item: string) => {
    setSelectedMenuItem(item);
  };

  const handleDashboardClick = () => {
    setSelectedMenuItem('dashboard');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <NavigationBar onDashboardClick={handleDashboardClick} />
      <Sidebar
        open={true}
        onClose={() => {}}
        onMenuItemClick={handleMenuItemClick}
        selectedItem={selectedMenuItem}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar />
        {selectedMenuItem === 'ba' ? <BusinessApplications /> :
         selectedMenuItem === 'approvals' ? <Approvals /> :
         children}
      </Box>
    </Box>
  );
};

export default Layout; 