const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const { auth, adminAuth } = require('../middleware/auth');

// Create job application
router.post('/', auth, async (req, res) => {
  try {
    const jobApplication = new JobApplication({
      ...req.body,
      user: req.user._id
    });
    await jobApplication.save();

    // Send notification for new job application
    global.sendNotification(req.user._id, {
      title: 'New Job Application Added',
      message: `You've added a new application for ${jobApplication.role} at ${jobApplication.company}`
    });

    res.status(201).json(jobApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all job applications for a user
router.get('/', auth, async (req, res) => {
  try {
    const { status, sortBy = 'appliedDate', sortOrder = 'desc' } = req.query;
    const query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await JobApplication.find(query)
      .sort(sort)
      .populate('user', 'name email');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job application
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job application
router.put('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['company', 'role', 'status', 'appliedDate', 'notes', 'location', 'salary', 'jobUrl'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    let jobQuery = { _id: req.params.id };

    // If the user is not an admin, ensure they can only update their own jobs
    if (req.user.role !== 'admin') {
      jobQuery.user = req.user._id;
    }

    const job = await JobApplication.findOne(jobQuery);

    if (!job) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    const oldStatus = job.status;
    updates.forEach(update => job[update] = req.body[update]);
    await job.save();

    // Send notification for status change
    if (updates.includes('status') && oldStatus !== job.status) {
      // For admin updates, send notification to the job owner
      const targetUserId = req.user.role === 'admin' ? job.user : req.user._id;
      global.sendNotification(targetUserId, {
        title: 'Application Status Updated',
        message: `Your application for ${job.role} at ${job.company} has been updated to ${job.status}`
      });
    }

    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete job application
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!job) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    // Send notification for job deletion
    global.sendNotification(req.user._id, {
      title: 'Job Application Deleted',
      message: `Your application for ${job.role} at ${job.company} has been deleted`
    });

    res.json({ message: 'Job application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { status, sortBy = 'appliedDate', sortOrder = 'desc' } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const jobs = await JobApplication.find(query)
      .sort(sort)
      .populate('user', 'name email');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 