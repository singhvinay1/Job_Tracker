const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'],
    default: 'Applied'
  },
  appliedDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  jobUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
jobApplicationSchema.index({ user: 1, status: 1 });
jobApplicationSchema.index({ appliedDate: -1 });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
module.exports = JobApplication; 