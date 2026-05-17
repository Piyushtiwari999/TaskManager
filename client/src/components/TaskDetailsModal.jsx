import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  MessageSquare, 
  User, 
  Flag, 
  Clock, 
  Send,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, user: 'Sarah Smith', text: 'Working on the final touches for the UI.', time: '2h ago', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 2, user: 'Admin User', text: 'Please ensure dark mode contrast is checked.', time: '1h ago', avatar: 'https://i.pravatar.cc/150?u=admin' },
  ]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now(),
      user: 'You',
      text: comment,
      time: 'Just now',
      avatar: 'https://i.pravatar.cc/150?u=me'
    };
    
    setComments([newComment, ...comments]);
    setComment('');
    toast.success('Comment added');
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-dark-lighter rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
          >
            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/5">
              <div className="flex items-center justify-between mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                  task.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {task.priority} Priority
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20} /></button>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 md:hidden"><X size={20} /></button>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">{task.description}</p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Assignee</p>
                  <div className="flex items-center gap-2">
                    <img src={task.avatar} className="w-6 h-6 rounded-full" alt="assignee" />
                    <span className="text-sm font-medium">Assignee Name</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Deadline</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{task.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <MessageSquare size={18} className="text-primary-600" />
                  Comments
                </h3>
                <form onSubmit={handleAddComment} className="relative">
                  <textarea
                    className="input-field pr-12 h-20 pt-3 resize-none"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 bottom-3 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
                  >
                    <Send size={16} />
                  </button>
                </form>

                <div className="space-y-6 pt-4">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <img src={c.avatar} className="w-8 h-8 rounded-full" alt={c.user} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold">{c.user}</span>
                          <span className="text-[10px] text-gray-500">{c.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar info (Desktop only) */}
            <div className="hidden md:block w-64 p-8 bg-gray-50 dark:bg-dark-lightest/30">
              <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
              
              <div className="space-y-8 mt-4">
                <div>
                  <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">Status</h4>
                  <div className="p-3 bg-white dark:bg-dark-lighter rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-sm font-medium">In Progress</span>
                    <Clock size={16} className="text-primary-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs text-gray-500 font-bold uppercase tracking-wider">Quick Actions</h4>
                  <button className="w-full p-3 text-left text-sm font-medium bg-white dark:bg-dark-lighter rounded-xl border border-gray-100 dark:border-white/5 hover:border-primary-500 transition-all flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" /> Mark Complete
                  </button>
                  <button className="w-full p-3 text-left text-sm font-medium bg-white dark:bg-dark-lighter rounded-xl border border-gray-100 dark:border-white/5 hover:border-red-500 transition-all flex items-center gap-2">
                    <Flag size={16} className="text-red-500" /> Report Issue
                  </button>
                </div>

                <div className="pt-8">
                  <p className="text-[10px] text-gray-400">Created on May 10, 2026</p>
                  <p className="text-[10px] text-gray-400">Last updated 1 hour ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailsModal;
