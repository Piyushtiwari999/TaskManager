const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Activity = require('./models/Activity');

dotenv.config();

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Activity.deleteMany();

    console.log('All data deleted successfully! Database is now clean.');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

clearDB();
