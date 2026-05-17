import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, Type, AlignLeft, Flag, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'Medium',
    members: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline) {
      return toast.error('Please fill in required fields');
    }
    onCreate(formData);
    toast.success('Project created successfully!');
    onClose();
  };

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-dark-lighter rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus size={20} className="text-primary-600" />
                Create New Project
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Title *</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="e.g. Website Redesign"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    className="input-field pl-10 h-24 pt-2 resize-none"
                    placeholder="Describe the project goals..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Deadline *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      className="input-field pl-10"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <div className="relative">
                    <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      className="input-field pl-10 appearance-none"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Assign Team Members</label>
                <button type="button" className="flex items-center gap-2 text-sm text-primary-600 font-bold hover:underline">
                  <Users size={16} /> Select Members
                </button>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-dark-lightest rounded-xl font-bold transition-all hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3 px-4"
                >
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateProjectModal;
