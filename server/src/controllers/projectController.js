const Project = require('../models/Project');
const Activity = require('../models/Activity');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  let projects;
  
  if (req.user.role === 'Admin') {
    projects = await Project.find().populate('members', 'name email avatar');
  } else {
    projects = await Project.find({ members: req.user.id }).populate('members', 'name email avatar');
  }

  res.status(200).json(projects);
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('members', 'name email avatar')
    .populate({
      path: 'tasks',
      populate: { path: 'assignedTo', select: 'name email avatar' }
    });

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if member belongs to project or is admin
  if (req.user.role !== 'Admin' && !project.members.some(m => m._id.toString() === req.user.id)) {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  res.status(200).json(project);
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  const { title, description, deadline, priority, members } = req.body;

  const project = await Project.create({
    title,
    description,
    deadline,
    priority,
    members: members || [req.user.id],
    createdBy: req.user.id,
  });

  await Activity.create({
    user: req.user.id,
    action: 'CREATE_PROJECT',
    details: `Created project: ${title}`,
    project: project._id,
  });

  res.status(201).json(project);
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  await Activity.create({
    user: req.user.id,
    action: 'UPDATE_PROJECT',
    details: `Updated project: ${project.title}`,
    project: project._id,
  });

  res.status(200).json(updatedProject);
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await project.deleteOne();

  await Activity.create({
    user: req.user.id,
    action: 'DELETE_PROJECT',
    details: `Deleted project: ${project.title}`,
  });

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
