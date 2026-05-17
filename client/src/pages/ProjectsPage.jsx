import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MoreVertical, 
  Calendar, 
  Users as UsersIcon,
  Search,
  Filter,
  X,
  Edit2,
  Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedProjectMembers, setSelectedProjectMembers] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    priority: 'Medium'
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    deadline: '',
    priority: 'Medium'
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', formData);
      toast.success('Project created!');
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create project';
      toast.error(msg);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    setDeleteLoading(true);
    try {
      await api.delete(`/projects/${projectId}`);
      toast.success('Project deleted!');
      setOpenMenuId(null);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleShowMembers = (e, project) => {
    e.preventDefault();
    setSelectedProjectMembers(project);
    setShowMembersModal(true);
  };

  const handleEditClick = (e, project) => {
    e.preventDefault();
    setEditingProject(project);
    setEditFormData({
      name: project.name,
      description: project.description,
      deadline: project.deadline,
      priority: project.priority
    });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.put(`/projects/${editingProject._id}`, editFormData);
      toast.success('Project updated!');
      setShowEditModal(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update project';
      toast.error(msg);
    } finally {
      setEditLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-100 dark:bg-red-500/10 dark:text-red-400';
      case 'Medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400';
      case 'Low': return 'text-green-600 bg-green-100 dark:bg-green-500/10 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Projects</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and track your team projects</p>
        </div>
        
        {user?.role === 'Admin' && (
          <Button onClick={() => setShowModal(true)}>
            <Plus size={20} /> New Project
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-lighter border border-gray-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
          />
        </div>
        <Button variant="secondary" className="px-4 py-2.5">
          <Filter size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            </Card>
          ))
        ) : (
          projects.map((project) => (
            <Link key={project._id} to={`/project/${project._id}`}>
              <Card className="p-6 h-full border-t-4 border-t-primary-600 group relative">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenMenuId(openMenuId === project._id ? null : project._id);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded"
                    >
                      <MoreVertical size={18} />
                    </button>
                    <AnimatePresence>
                      {openMenuId === project._id && user?.role === 'Admin' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-lighter rounded-lg shadow-xl border border-gray-100 dark:border-white/5 z-40"
                        >
                          <button
                            onClick={(e) => handleEditClick(e, project)}
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                          >
                            <Edit2 size={16} />
                            Edit Project
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteProject(project._id);
                            }}
                            disabled={deleteLoading}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors border-t border-gray-100 dark:border-white/5 last:rounded-b-lg disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Delete Project
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors dark:text-white">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-6">
                  {project.description}
                </p>

                <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-white/5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Calendar size={16} />
                      <span>{new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={(e) => handleShowMembers(e, project)}
                      className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <UsersIcon size={16} />
                      <span>{project.team?.length || 0}</span>
                    </button>
                  </div>
                  
                  <div className="w-full bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-600 h-full transition-all duration-1000" 
                      style={{ width: '45%' }} // Placeholder progress
                    />
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-dark-lighter rounded-2xl shadow-2xl p-8 overflow-hidden"
            >
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Create New Project</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Project Name"
                  placeholder="e.g. Website Redesign"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-dark dark:border-white/10 dark:text-white h-24 resize-none"
                    placeholder="Describe the project goals (min 10 chars)..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    required
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-dark dark:border-white/10 dark:text-white"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <Button variant="secondary" className="flex-1" type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" type="submit">
                    Create Project
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Project Members Modal */}
      <AnimatePresence>
        {showMembersModal && selectedProjectMembers && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMembersModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-dark-lighter rounded-2xl shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold dark:text-white">Project Members</h2>
                <button 
                  onClick={() => setShowMembersModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Team members assigned to <strong>{selectedProjectMembers.name}</strong>:
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedProjectMembers.team && selectedProjectMembers.team.length > 0 ? (
                  selectedProjectMembers.team.map(member => (
                    <div key={member._id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <img 
                        src={member.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold dark:text-white">{member.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No members assigned yet</p>
                )}
              </div>
              <button
                onClick={() => setShowMembersModal(false)}
                className="w-full mt-6 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {showEditModal && editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !editLoading && setShowEditModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-dark-lighter rounded-2xl shadow-2xl p-8 overflow-hidden"
            >
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Edit Project</h2>
              <form onSubmit={handleSubmitEdit} className="space-y-4">
                <Input
                  label="Project Name"
                  placeholder="e.g. Website Redesign"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  required
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-dark dark:border-white/10 dark:text-white h-24 resize-none"
                    placeholder="Describe the project goals (min 10 chars)..."
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Deadline"
                    type="date"
                    value={editFormData.deadline}
                    onChange={(e) => setEditFormData({...editFormData, deadline: e.target.value})}
                    required
                  />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-dark dark:border-white/10 dark:text-white"
                      value={editFormData.priority}
                      onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <Button variant="secondary" className="flex-1" type="button" onClick={() => setShowEditModal(false)} disabled={editLoading}>
                    Cancel
                  </Button>
                  <Button className="flex-1" type="submit" isLoading={editLoading}>
                    Update Project
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsPage;
