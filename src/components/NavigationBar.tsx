import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
  InputBase,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TFSLogo from '../assets/TFS_logo_global_2022.avif';

interface NavigationBarProps {
  onDashboardClick: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onDashboardClick }) => {
  const { logout, authState } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
  };

  const handleHelpClick = () => {
    navigate('/help');
  };

  const handleDashboardClick = () => {
    navigate('/');
    onDashboardClick();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img src={TFSLogo} alt="TFS Logo" style={{ height: 32, marginRight: 12 }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
            Developer Portal
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ mr: 2, width: 250 }}>
          <Paper
            sx={{ display: 'flex', alignItems: 'center', height: 36, pl: 1, pr: 1, boxShadow: 0 }}
          >
            <InputBase
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Paper>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Dashboard">
            <IconButton
              color="inherit"
              onClick={handleDashboardClick}
              disabled={!authState.isAuthenticated}
            >
              <DashboardIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="DevAgent Help">
            <IconButton color="inherit" onClick={handleHelpClick}>
              <SmartToyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton
              color="inherit"
              onClick={handleLogout}
              disabled={!authState.isAuthenticated}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar; 