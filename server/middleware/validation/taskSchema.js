const Joi = require('joi');

const taskSchema = Joi.object({
  project: Joi.string().required(),
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).allow('', null),
  priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
  status: Joi.string().valid('Todo', 'In Progress', 'Completed').default('Todo'),
  deadline: Joi.string().allow('', null), // Use string to handle date input safely
  assignedTo: Joi.string().allow('', null)
});

module.exports = taskSchema;
