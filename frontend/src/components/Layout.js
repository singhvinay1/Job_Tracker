import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import NotificationMenu from './NotificationMenu';
import api from '../config/axios';

const drawerWidth = 240;

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({ open: false, message: '', severity: 'info' });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Test backend connection
    const testConnection = async () => {
      try {
        await api.get('/api/jobs');
        setConnectionStatus({
          open: true,
          message: 'Successfully connected to backend!',
          severity: 'success'
        });
      } catch (error) {
        setConnectionStatus({
          open: true,
          message: 'Failed to connect to backend. Please check your connection.',
          severity: 'error'
        });
      }
    };

    testConnection();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => navigate('/jobs/new')}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add Job" />
        </ListItem>
        {user?.role === 'admin' && (
          <ListItem button onClick={() => navigate('/dashboard/admin')}>
            <ListItemIcon>
              <AdminIcon />
            </ListItemIcon>
            <ListItemText primary="Admin Panel" />
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Job Application Tracker
          </Typography>
          <NotificationMenu />
          {user && (
            <Button
              color="inherit"
              onClick={handleMenu}
              startIcon={<PersonIcon />}
              sx={{ ml: 2 }}
            >
              {user?.name}
            </Button>
          )}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.paper',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      <Snackbar
        open={connectionStatus.open}
        autoHideDuration={6000}
        onClose={() => setConnectionStatus({ ...connectionStatus, open: false })}
      >
        <Alert severity={connectionStatus.severity} onClose={() => setConnectionStatus({ ...connectionStatus, open: false })}>
          {connectionStatus.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Layout; 