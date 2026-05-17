import React, { useState, useEffect, useRef } from 'react';
import { Bell, Moon, Sun, Search, CheckCircle, Clock, MessageSquare, UserPlus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  
  const pageTitle = location.pathname.split('/')[1] || 'Dashboard';

  useEffect(() => {
    fetchActivities();
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchActivities = async () => {
    try {
      const { data } = await api.get('/users/activities');
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED': return <CheckCircle size={14} className="text-green-500" />;
      case 'TASK_UPDATED': return <Clock size={14} className="text-blue-500" />;
      case 'COMMENT_ADDED': return <MessageSquare size={14} className="text-amber-500" />;
      case 'USER_INVITED': return <UserPlus size={14} className="text-purple-500" />;
      default: return <Bell size={14} className="text-gray-500" />;
    }
  };

  const handleNotificationClick = (activity) => {
    setShowNotifications(false);
    if (activity.project) {
      navigate(`/project/${activity.project._id}`);
    } else {
      navigate('/activity');
    }
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-30 transition-all">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
        {pageTitle}
      </h2>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="pl-10 pr-4 py-1.5 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary-500 rounded-full text-sm w-64 transition-all focus:outline-none dark:text-white"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 rounded-full transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 rounded-full relative transition-all"
            >
              <Bell size={20} />
              {activities.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-dark animate-pulse"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-lighter rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                    <h3 className="font-bold dark:text-white text-sm">Recent Activity</h3>
                    <span className="text-[10px] text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-full uppercase">
                      {activities.length} New
                    </span>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto">
                    {loading ? (
                      <div className="p-8 text-center text-sm text-gray-500 italic">Loading...</div>
                    ) : activities.length > 0 ? (
                      activities.map((activity) => (
                        <div 
                          key={activity._id} 
                          onClick={() => handleNotificationClick(activity)}
                          className="p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex gap-3 cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-lightest flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="space-y-1 flex-1">
                            <p className="text-xs dark:text-white line-clamp-2">
                              <span className="font-bold">{activity.user?.name}</span> {activity.description}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-sm text-gray-500 italic">
                        No new notifications
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => { setShowNotifications(false); navigate('/activity'); }}
                    className="w-full p-3 text-xs font-bold text-center text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-white/5 transition-all border-t border-gray-50 dark:border-white/5"
                  >
                    View All Activity
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
