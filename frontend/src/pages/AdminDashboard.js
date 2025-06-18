import React, { useState, useEffect, useCallback } from 'react';
import api from '../config/axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Sort as SortIcon
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContext';

const statusColors = {
  Applied: 'primary',
  Interview: 'info',
  Offer: 'success',
  Rejected: 'error',
  Accepted: 'success'
};

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const { socket } = useNotifications();

  const fetchJobs = useCallback(async () => {
    try {
      const response = await api.get('/api/jobs/admin/all', {
        params: {
          status: statusFilter || undefined,
          sortBy: 'appliedDate',
          sortOrder
        }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }, [statusFilter, sortOrder]);

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, sortOrder, fetchJobs]);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification) => {
        console.log('Admin Dashboard received real-time notification:', notification);
        fetchJobs();
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [socket, fetchJobs]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Interview">Interview</MenuItem>
            <MenuItem value="Offer">Offer</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
          </Select>
        </FormControl>

        <Tooltip title={`Sort by date (${sortOrder === 'desc' ? 'newest first' : 'oldest first'})`}>
          <IconButton onClick={toggleSortOrder}>
            <SortIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.role}</TableCell>
                <TableCell>{job.user.name}</TableCell>
                <TableCell>
                  <Chip
                    label={job.status}
                    color={statusColors[job.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(job.appliedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{job.location || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard; 