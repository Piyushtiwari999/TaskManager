const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMemberToProject,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const projectSchema = require('../middleware/validation/projectSchema');

router.route('/')
  .get(protect, getProjects)
  .post(protect, admin, validateRequest(projectSchema), createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, admin, validateRequest(projectSchema), updateProject)
  .delete(protect, admin, deleteProject);

router.route('/:id/members')
  .patch(protect, addMemberToProject);

module.exports = router;
