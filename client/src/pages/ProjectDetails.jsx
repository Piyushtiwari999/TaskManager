import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Target, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  History,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project] = useState({
    title: 'Modernizing TaskFlow UI',
    description: 'A comprehensive overhaul of the TaskFlow Pro interface to align with modern design standards and improve user experience.',
    deadline: 'June 30, 2026',
    priority: 'High',
    progress: 65,
    members: [
      { name: 'John Doe', role: 'Lead Designer', avatar: 'https://i.pravatar.cc/150?u=1' },
      { name: 'Sarah Smith', role: 'Frontend Developer', avatar: 'https://i.pravatar.cc/150?u=2' },
      { name: 'Mike Johnson', role: 'Backend Developer', avatar: 'https://i.pravatar.cc/150?u=3' },
    ],
    activities: [
      { user: 'John Doe', action: 'updated the design system', time: '2 hours ago' },
      { user: 'Sarah Smith', action: 'completed task "Responsive Layout"', time: '5 hours ago' },
      { user: 'Mike Johnson', action: 'started working on "API Integration"', time: 'Yesterday' },
    ]
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase">{project.priority} Priority</span>
            <span className="text-gray-400 text-sm">Project ID: #{id || 'TF-42'}</span>
          </div>
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{project.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white dark:bg-dark-lighter border border-gray-200 dark:border-white/5 rounded-xl font-medium hover:bg-gray-50 transition-all">Edit Project</button>
          <button className="btn-primary">Add Member</button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Card */}
          <div className="p-8 rounded-2xl bg-white dark:bg-dark-lighter border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Overall Progress</h3>
              <span className="text-2xl font-bold text-primary-600">{project.progress}%</span>
            </div>
            <div className="w-full h-4 bg-gray-100 dark:bg-dark-lightest rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary-600"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <p className="text-gray-500 text-xs mb-1 uppercase font-bold tracking-wider">Tasks</p>
                <p className="text-xl font-bold">24/36</p>
              </div>
              <div className="text-center border-x border-gray-100 dark:border-white/5">
                <p className="text-gray-500 text-xs mb-1 uppercase font-bold tracking-wider">Days Left</p>
                <p className="text-xl font-bold">18</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs mb-1 uppercase font-bold tracking-wider">Budget</p>
                <p className="text-xl font-bold">$12k</p>
              </div>
            </div>
          </div>

          {/* Task List Preview */}
          <div className="p-8 rounded-2xl bg-white dark:bg-dark-lighter border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold">Project Tasks</h3>
              <button className="text-primary-600 text-sm font-bold hover:underline">View All Board</button>
            </div>
            <div className="space-y-4">
              {['Design System Update', 'Login API Integration', 'Kanban Component'].map((task, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 dark:border-white/5 hover:border-primary-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center group-hover:border-primary-500">
                      <CheckCircle2 size={14} className="text-transparent group-hover:text-primary-500" />
                    </div>
                    <span className="font-medium">{task}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">Due May 24</span>
                    <img src={`https://i.pravatar.cc/150?u=${idx + 10}`} className="w-6 h-6 rounded-full" alt="user" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Team & Activity */}
        <div className="space-y-8">
          {/* Team Members */}
          <div className="p-8 rounded-2xl bg-white dark:bg-dark-lighter border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Users size={20} /> Team Members
            </h3>
            <div className="space-y-6">
              {project.members.map((member, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-sm font-bold">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl text-gray-500 text-sm font-bold hover:border-primary-500 hover:text-primary-500 transition-all flex items-center justify-center gap-2">
                <Plus size={18} /> Invite Others
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="p-8 rounded-2xl bg-white dark:bg-dark-lighter border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <History size={20} /> Activity Log
            </h3>
            <div className="space-y-6">
              {project.activities.map((activity, idx) => (
                <div key={idx} className="relative pl-6 pb-6 last:pb-0">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-100 dark:bg-white/5"></div>
                  <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-primary-600"></div>
                  <p className="text-sm">
                    <span className="font-bold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
