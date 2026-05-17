const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Activity = require('./models/Activity');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for realistic seeding...');

    // Clear existing
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Activity.deleteMany();

    // Create Admin
    const admin = await User.create({
      name: 'Sarah Chen',
      email: 'sarah.chen@taskflow.pro',
      password: 'admin123',
      role: 'Admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    });

    // Create Members
    const member1 = await User.create({
      name: 'Marcus Miller',
      email: 'marcus.m@taskflow.pro',
      password: 'member123',
      role: 'Member',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
    });

    const member2 = await User.create({
      name: 'Elena Rodriguez',
      email: 'elena.r@taskflow.pro',
      password: 'member123',
      role: 'Member',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
    });

    // Create Projects
    const project1 = await Project.create({
      name: 'Nexus Enterprise Cloud',
      description: 'Building the next-generation multi-cloud management infrastructure for enterprise scalability.',
      status: 'Active',
      priority: 'High',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
      team: [member1._id, member2._id]
    });

    const project2 = await Project.create({
      name: 'Solaris Design System',
      description: 'Unified cross-platform design language and component library for consistent UI delivery.',
      status: 'Active',
      priority: 'Medium',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      createdBy: admin._id,
      team: [member1._id]
    });

    // Create Tasks for Project 1
    const tasks = [
      {
        project: project1._id,
        title: 'Infrastructure Security Audit',
        description: 'Complete end-to-end security assessment of the new cloud gateway modules.',
        status: 'In Progress',
        priority: 'High',
        assignedTo: member1._id,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        project: project1._id,
        title: 'Kafka Stream Integration',
        description: 'Implement real-time data streaming between the core API and the analytics engine.',
        status: 'Todo',
        priority: 'Medium',
        assignedTo: member2._id,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        project: project1._id,
        title: 'GraphQL Schema Optimization',
        description: 'Refactor complex nested queries to reduce database latency by 30%.',
        status: 'Completed',
        priority: 'Low',
        assignedTo: member1._id,
        deadline: new Date()
      }
    ];

    await Task.insertMany(tasks);

    // Log Initial Activity
    await Activity.create({
      user: admin._id,
      type: 'PROJECT_CREATED',
      description: 'Initialized Nexus Enterprise Cloud Project',
      project: project1._id
    });

    console.log('Real-world Enterprise data seeded successfully! 🏢🚀');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
