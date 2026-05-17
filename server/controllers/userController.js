const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { sendInviteEmail } = require('../utils/emailService');

// @desc    Get all users (for team selection)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Get recent activities
// @route   GET /api/users/activities
// @access  Private
const getRecentActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name avatar')
    .populate('project', 'name')
    .populate('task', 'title');
  res.json(activities);
});

// @desc    Get dashboard stats
// @route   GET /api/users/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalProjects = await User.countDocuments(); // This is wrong, should be Projects. 
  // Wait, let's fix this.
  const Project = require('../models/Project');
  const Task = require('../models/Task');

  const projectsCount = await Project.countDocuments(req.user.role === 'Admin' ? {} : { team: req.user._id });
  const tasksCount = await Task.countDocuments(req.user.role === 'Admin' ? {} : { assignedTo: req.user._id });
  const completedTasks = await Task.countDocuments({
    status: 'Completed',
    ...(req.user.role === 'Admin' ? {} : { assignedTo: req.user._id })
  });
  const membersCount = await User.countDocuments();

  res.json({
    projectsCount,
    tasksCount,
    completedTasks,
    membersCount,
  });
});

// @desc    Invite a new member
// @route   POST /api/users/invite
// @access  Private/Admin
const inviteUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email');
  }

  // Simulate or send actual email
  try {
    await sendInviteEmail(email, req.user.name);

    // Log activity
    await Activity.create({
      user: req.user._id,
      type: 'COMMENT_ADDED', // Using a generic type for now or could add 'USER_INVITED'
      description: `Invited ${email} to the team`,
    });

    res.status(200).json({ message: `Invitation sent to ${email}` });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500);
    throw new Error('Failed to send invitation email. Check your SMTP settings.');
  }
});

module.exports = {
  getUsers,
  getRecentActivities,
  getDashboardStats,
  inviteUser,
};
