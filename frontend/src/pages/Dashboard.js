import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../config/axios';
import { useNotifications } from '../contexts/NotificationContext'; // Import useNotifications

const Dashboard = () => {
  const navigate = useNavigate();
  const { username } = useParams(); // Get username from URL
  const location = useLocation(); // Get location object for state
  const { socket } = useNotifications(); // Get socket from notification context
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    console.log('Dashboard useEffect triggered.');
    console.log('location.state:', location.state);

    fetchJobs();
    // Check if refresh state is passed from navigation
    if (location.state?.refresh) {
      console.log('Refresh state detected, re-fetching jobs.'); // Debug log
      fetchJobs();
      // Clear the state to prevent re-fetching on subsequent renders
      navigate(location.pathname, { replace: true, state: {} });
      console.log('Refresh state cleared.'); // Debug log
    }
  }, [location.state?.refresh, username]); // Add username to dependencies

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification) => {
        console.log('Received real-time notification:', notification);
        // Re-fetch jobs when a notification is received
        fetchJobs();
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [socket]); // Depend on socket

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs...'); // Debug log
      setLoading(true); // Set loading to true when fetching starts
      const response = await api.get('/api/jobs');
      setJobs(response.data);
      console.log('Jobs fetched successfully.', response.data); // Debug log
    } catch (err) {
      console.error('Error fetching jobs:', err); // Debug log
      setError('Failed to fetch jobs');
      setSnackbar({ open: true, message: 'Failed to fetch jobs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await api.delete(`/api/jobs/${id}`);
        setJobs(jobs.filter(job => job._id !== id));
        setSnackbar({ open: true, message: 'Job application deleted successfully', severity: 'success' });
        // After deletion, re-fetch jobs to update the list
        fetchJobs();
        console.log('Job deleted, re-fetching jobs.'); // Debug log
      } catch (err) {
        console.error('Error deleting job:', err); // Debug log
        setError('Failed to delete job application');
        setSnackbar({ open: true, message: 'Failed to delete job application', severity: 'error' });
      }
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.role.toLowerCase().includes(search.toLowerCase()) ||
                         job.company.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {username ? `${username}'s Dashboard` : 'My Dashboard'}
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Search jobs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Select
            fullWidth
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Interview">Interview</MenuItem>
            <MenuItem value="Offer">Offer</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => navigate('/jobs/new')}
          >
            Add New Job
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.role}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>{new Date(job.appliedDate).toLocaleDateString()}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/jobs/${job._id}/edit`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(job._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard; 