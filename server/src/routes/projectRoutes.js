const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router
  .route('/')
  .get(protect, getProjects)
  .post(protect, authorize('Admin'), createProject);

router
  .route('/:id')
  .get(protect, getProjectById)
  .put(protect, authorize('Admin'), updateProject)
  .delete(protect, authorize('Admin'), deleteProject);

module.exports = router;
