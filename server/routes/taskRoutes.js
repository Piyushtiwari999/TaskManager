const express = require('express');
const router = express.Router();
const {
  getTasksByProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addTaskComment,
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const taskSchema = require('../middleware/validation/taskSchema');

// Allow both Admin and Members to create tasks
router.route('/')
  .get(protect, getTasks)
  .post(protect, validateRequest(taskSchema), createTask);

router.route('/project/:projectId')
  .get(protect, getTasksByProject);

router.route('/:id')
  .put(protect, validateRequest(taskSchema), updateTask)
  .delete(protect, admin, deleteTask);

router.route('/:id/comments').post(protect, addTaskComment);

module.exports = router;
