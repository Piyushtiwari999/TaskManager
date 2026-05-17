const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name email avatar');
  res.json(tasks);
});

// @desc    Get all tasks for the user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role !== 'Admin') {
    query = { assignedTo: req.user._id };
  }
  const tasks = await Task.find(query).populate('assignedTo', 'name email avatar').populate('project', 'name');
  res.json(tasks);
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = asyncHandler(async (req, res) => {
  const { project, title, description, priority, deadline, assignedTo } = req.body;

  const task = new Task({
    project,
    title,
    description,
    priority,
    deadline,
    assignedTo,
  });

  const createdTask = await task.save();

  // Log activity
  await Activity.create({
    user: req.user._id,
    type: 'TASK_ASSIGNED',
    description: `Created task: ${title}`,
    project,
    task: createdTask._id,
  });

  // Emit Real-time event
  const io = req.app.get('socketio');
  io.to(project.toString()).emit('task_created', createdTask);

  res.status(201).json(createdTask);
});

// @desc    Update task status/details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, deadline, assignedTo } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    const oldStatus = task.status;
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.deadline = deadline || task.deadline;
    task.assignedTo = assignedTo || task.assignedTo;

    const updatedTask = await task.save();

    if (oldStatus !== status) {
      // Log status change
      await Activity.create({
        user: req.user._id,
        type: 'TASK_UPDATED',
        description: `Updated task status to ${status}: ${task.title}`,
        project: task.project,
        task: task._id,
      });
    }

    // Emit Real-time event
    const io = req.app.get('socketio');
    io.to(task.project.toString()).emit('task_updated', updatedTask);

    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addTaskComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    const comment = {
      user: req.user._id,
      text,
    };

    task.comments.push(comment);
    await task.save();

    // Log activity
    await Activity.create({
      user: req.user._id,
      type: 'COMMENT_ADDED',
      description: `Added comment to task: ${task.title}`,
      project: task.project,
      task: task._id,
    });

    // Emit Real-time event
    const io = req.app.get('socketio');
    io.to(task.project.toString()).emit('comment_added', { taskId: task._id, comments: task.comments });

    res.status(201).json(task.comments);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

module.exports = {
  getTasksByProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addTaskComment,
};
