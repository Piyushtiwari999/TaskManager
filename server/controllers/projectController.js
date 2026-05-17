const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const Activity = require('../models/Activity');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  let projects;
  if (req.user.role === 'Admin') {
    projects = await Project.find({}).populate('team', 'name email avatar');
  } else {
    projects = await Project.find({ team: req.user._id }).populate('team', 'name email avatar');
  }
  res.json(projects);
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('team', 'name email avatar');

  if (project) {
    // Check if user is part of the project or is an admin
    const isMember = project.team.some((member) => member._id.toString() === req.user._id.toString());
    if (req.user.role === 'Admin' || isMember) {
      res.json(project);
    } else {
      res.status(401);
      throw new Error('Not authorized to view this project');
    }
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
  const { name, description, deadline, priority, team } = req.body;

  const project = new Project({
    name,
    description,
    deadline,
    priority,
    team: team || [req.user._id],
    createdBy: req.user._id,
  });

  const createdProject = await project.save();

  // Log activity
  await Activity.create({
    user: req.user._id,
    type: 'PROJECT_CREATED',
    description: `Created project: ${name}`,
    project: createdProject._id,
  });

  res.status(201).json(createdProject);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, deadline, priority, team, status } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    project.name = name || project.name;
    project.description = description || project.description;
    project.deadline = deadline || project.deadline;
    project.priority = priority || project.priority;
    project.team = team || project.team;
    project.status = status || project.status;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();
    
    // Log activity
    await Activity.create({
      user: req.user._id,
      type: 'PROJECT_DELETED',
      description: `Deleted project: ${project.name}`,
    });

    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Add member to project
// @route   PATCH /api/projects/:id/members
// @access  Private/Admin
const addMemberToProject = asyncHandler(async (req, res) => {
  const { memberId } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is admin or project creator
  if (req.user.role !== 'Admin' && project.createdBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add members to this project');
  }

  // Check if member already exists in project
  if (project.team.includes(memberId)) {
    res.status(400);
    throw new Error('Member already in project');
  }

  // Add member to project
  project.team.push(memberId);
  const updatedProject = await project.save();

  // Log activity
  await Activity.create({
    user: req.user._id,
    type: 'MEMBER_ADDED',
    description: `Added member to project: ${project.name}`,
    project: project._id,
  });

  res.json(updatedProject.populate('team', 'name email avatar'));
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMemberToProject,
};
