import { motion } from 'framer-motion';
import { Calendar, Users, Target, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-white dark:bg-dark-lighter border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
          project.priority === 'High' ? 'bg-red-100 text-red-600' : 
          project.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 
          'bg-green-100 text-green-600'
        }`}>
          {project.priority}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={18} />
        </button>
      </div>

      <Link to={`/projects/${project._id}`} className="block group">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">{project.title}</h3>
      </Link>
      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6">{project.description}</p>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Progress</span>
          <span className="font-bold">{project.progress || 0}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-dark-lightest rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 transition-all duration-500" 
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50 dark:border-white/5">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <img 
              key={i}
              src={`https://i.pravatar.cc/150?u=${i + project.title}`} 
              alt="member" 
              className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-lighter shadow-sm"
            />
          ))}
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-lightest border-2 border-white dark:border-dark-lighter flex items-center justify-center text-[10px] font-bold text-gray-500">
            +2
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Calendar size={14} />
          {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
