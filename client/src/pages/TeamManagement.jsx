import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Shield, MoreVertical, Plus, Search, UserPlus, X, Trash2, UserCheck, GitBranch } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

const TeamManagement = () => {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedMemberForProject, setSelectedMemberForProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchMembers();
    fetchProjects();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/users');
      setMembers(data);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects');
    }
  };

  const handleAddToProject = async (projectId) => {
    if (!selectedMemberForProject) return;
    
    setProjectLoading(true);
    try {
      await api.patch(`/projects/${projectId}/members`, {
        memberId: selectedMemberForProject._id,
        role: 'Member'
      });
      toast.success(`${selectedMemberForProject.name} added to project`);
      setShowProjectModal(false);
      setSelectedMemberForProject(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member to project');
    } finally {
      setProjectLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Team Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your organization's members and roles.</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
          <UserPlus size={18} />
          Invite Member
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Members', value: members.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Admins', value: members.filter(m => m.role === 'Admin').length, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Platform Users', value: members.length, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
        ].map((stat, idx) => (
          <Card key={idx} className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} bg-opacity-20`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold dark:text-white">{loading ? '...' : stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-lighter border border-gray-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
          />
        </div>
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-dark-lighter border border-gray-100 dark:border-white/5 rounded-xl text-sm dark:text-white sm:w-48 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option>All Roles</option>
          <option>Admin</option>
          <option>Member</option>
        </select>
      </div>

      {/* Members Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-10 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} 
                          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 dark:border-white/10" 
                        />
                        <span className="font-bold dark:text-white">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        member.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' 
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">{member.email}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === member._id ? null : member._id)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                        >
                          <MoreVertical size={18} />
                        </button>
                        <AnimatePresence>
                          {openMenuId === member._id && (
                            <motion.div
                              ref={menuRef}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-0 mt-1 w-48 bg-white dark:bg-dark-lighter rounded-lg shadow-xl border border-gray-100 dark:border-white/5 z-40"
                            >
                              <button
                                onClick={() => {
                                  setSelectedMemberForProject(member);
                                  setShowProjectModal(true);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center gap-2 transition-colors first:rounded-t-lg"
                              >
                                <GitBranch size={16} />
                                Add to Project
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !inviting && setShowInviteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-dark-lighter rounded-2xl shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Invite New Member</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Enter the email address of the person you want to invite to your organization.</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!inviteEmail) return toast.error('Please enter an email');
                
                setInviting(true);
                api.post('/users/invite', { email: inviteEmail })
                  .then(() => {
                    toast.success(`Invitation sent to ${inviteEmail}`);
                    setShowInviteModal(false);
                    setInviteEmail('');
                  })
                  .catch(error => {
                    toast.error(error.response?.data?.message || 'Failed to send invitation. Check SMTP settings.');
                  })
                  .finally(() => setInviting(false));
              }} className="space-y-4">
                <input 
                  type="email" 
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                />
                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button"
                    variant="secondary" 
                    className="flex-1" 
                    onClick={() => setShowInviteModal(false)}
                    disabled={inviting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1" 
                    isLoading={inviting}
                  >
                    Send Invite
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add to Project Modal */}
      <AnimatePresence>
        {showProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !projectLoading && setShowProjectModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-dark-lighter rounded-2xl shadow-2xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold dark:text-white">
                  Add {selectedMemberForProject?.name} to Project
                </h2>
                <button 
                  onClick={() => setShowProjectModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Select a project to add this member to:</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {projects.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No projects available</p>
                ) : (
                  projects.map(project => (
                    <button
                      key={project._id}
                      onClick={() => handleAddToProject(project._id)}
                      disabled={projectLoading}
                      className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                      <p className="font-semibold dark:text-white">{project.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
                    </button>
                  ))
                )}
              </div>
              <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <Button 
                  variant="secondary" 
                  className="flex-1" 
                  onClick={() => setShowProjectModal(false)}
                  disabled={projectLoading}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManagement;
