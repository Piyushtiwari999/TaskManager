const express = require('express');
const router = express.Router();
const {
  getTasksByProject,
  createTask,
  updateTask,
  addComment,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.post('/', protect, authorize('Admin'), createTask);
router.get('/project/:projectId', protect, getTasksByProject);
router.put('/:id', protect, updateTask);
router.post('/:id/comments', protect, addComment);
router.delete('/:id', protect, authorize('Admin'), deleteTask);

module.exports = router;
