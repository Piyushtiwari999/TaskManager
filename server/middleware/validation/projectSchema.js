const Joi = require('joi');

const projectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  deadline: Joi.date().iso().required(),
  priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
  team: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('Active', 'Completed', 'On Hold').default('Active')
});

module.exports = projectSchema;
