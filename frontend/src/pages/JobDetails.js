import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../config/axios';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/api/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError('Failed to fetch job details.');
        setSnackbar({ open: true, message: 'Failed to fetch job details.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/jobs/${id}`);
      setSnackbar({ open: true, message: 'Job deleted successfully!', severity: 'success' });
      navigate('/dashboard'); // Redirect to dashboard after deletion
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete job.', severity: 'error' });
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  if (!job) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Job not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{job.title}</Typography>
        <Typography variant="h6" color="textSecondary">Company: {job.company}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>Location: {job.location}</Typography>
        <Typography variant="body1">Status: {job.status}</Typography>
        <Typography variant="body1">Applied Date: {new Date(job.appliedDate).toLocaleDateString()}</Typography>
        {job.notes && (
          <Typography variant="body1" sx={{ mt: 2 }}>Notes: {job.notes}</Typography>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/jobs/${id}/edit`)}
          >
            Edit Job
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteClick}
          >
            Delete Job
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this job application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
}

export default JobDetails; 