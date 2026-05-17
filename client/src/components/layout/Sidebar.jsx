import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  CheckSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ user, logout }) => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FolderKanban size={20} />, label: 'Projects', path: '/projects' },
    { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
    { icon: <Users size={20} />, label: 'Team', path: '/team', adminOnly: true },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  const filteredMenu = menuItems.filter(item => !item.adminOnly || user?.role === 'Admin');

  return (
    <div className="w-64 h-screen bg-white dark:bg-dark border-r border-gray-100 dark:border-white/5 flex flex-col transition-all">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
          T
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow Pro</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${isActive 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' 
                : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5'}
            `}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold uppercase">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
