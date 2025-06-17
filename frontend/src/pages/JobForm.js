import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import api from '../config/axios';

const statuses = ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];
const jobTitles = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Data Scientist',
  'Product Manager',
  'Project Manager',
  'Quality Assurance Engineer',
  'Business Analyst',
  'Network Engineer',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'Technical Support Specialist',
  'Other'
];
const jobLocations = [
  'Remote',
  'On-site',
  'Hybrid',
  'New York, NY',
  'San Francisco, CA',
  'Seattle, WA',
  'London, UK',
  'Berlin, Germany',
  'Toronto, Canada',
  'Sydney, Australia',
  'Bangalore, India',
  'Other'
];

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    location: '',
    status: 'Applied',
    appliedDate: new Date(),
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const fetchJob = async () => {
        try {
          const response = await api.get(`/api/jobs/${id}`);
          const jobData = response.data;
          setFormData({
            role: jobData.role,
            company: jobData.company,
            location: jobData.location,
            status: jobData.status,
            appliedDate: new Date(jobData.appliedDate),
            notes: jobData.notes || '',
          });
        } catch (err) {
          setError('Failed to load job for editing.');
          setSnackbar({ open: true, message: 'Failed to load job for editing.', severity: 'error' });
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, appliedDate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await api.put(`/api/jobs/${id}`, formData);
        setSnackbar({ open: true, message: 'Job updated successfully!', severity: 'success' });
      } else {
        await api.post('/api/jobs', formData);
        setSnackbar({ open: true, message: 'Job added successfully!', severity: 'success' });
      }
      navigate('/dashboard', { state: { refresh: true } });
      console.log('Navigating to dashboard with refresh state.');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred.';
      setError(errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            {isEditing ? 'Edit Job Application' : 'Add New Job Application'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              select
              label="Job Title"
              name="role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            >
              {jobTitles.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              select
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            >
              {jobLocations.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            >
              {statuses.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <DatePicker
              label="Applied Date"
              value={formData.appliedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
            />
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (isEditing ? 'Update Job' : 'Add Job')}
            </Button>
          </form>
        </Paper>

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
    </LocalizationProvider>
  );
};

export default JobForm; 