const Task = require('../models/Task');
const Activity = require('../models/Activity');
const Project = require('../models/Project');

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name email avatar');
  res.status(200).json(tasks);
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res) => {
  const { title, description, project, assignedTo, priority, deadline } = req.body;

  const task = await Task.create({
    title,
    description,
    project,
    assignedTo,
    priority,
    deadline,
  });

  await Activity.create({
    user: req.user.id,
    action: 'CREATE_TASK',
    details: `Created task: ${title}`,
    project: project,
    task: task._id,
  });

  res.status(201).json(task);
};

// @desc    Update task status/details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Update status is allowed for assigned user or admin
  // For other details, only Admin (simplification for now)
  
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  await Activity.create({
    user: req.user.id,
    action: 'UPDATE_TASK',
    details: `Updated task: ${task.title} to ${req.body.status || 'new state'}`,
    project: task.project,
    task: task._id,
  });

  res.status(200).json(updatedTask);
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const comment = {
    user: req.user.id,
    text: req.body.text,
  };

  task.comments.push(comment);
  await task.save();

  res.status(200).json(task.comments);
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();

  await Activity.create({
    user: req.user.id,
    action: 'DELETE_TASK',
    details: `Deleted task: ${task.title}`,
    project: task.project,
  });

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getTasksByProject,
  createTask,
  updateTask,
  addComment,
  deleteTask,
};
