import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, MessageSquare, UserPlus, Filter, Search, Calendar, RefreshCcw, ChevronDown } from 'lucide-react';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { toast } from 'react-hot-toast';

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setRefreshing(true);
    try {
      const { data } = await api.get('/users/activities');
      setActivities(data);
      if (!loading) toast.success('Activities refreshed');
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED': return <CheckCircle size={20} className="text-green-500" />;
      case 'TASK_UPDATED': return <Clock size={20} className="text-blue-500" />;
      case 'COMMENT_ADDED': return <MessageSquare size={20} className="text-amber-500" />;
      case 'USER_INVITED': return <UserPlus size={20} className="text-purple-500" />;
      default: return <Clock size={20} className="text-gray-500" />;
    }
  };

  const activityTypes = ['All', 'TASK_ASSIGNED', 'TASK_UPDATED', 'COMMENT_ADDED', 'USER_INVITED'];

  const filteredActivities = activities.filter(a => {
    const matchesSearch = a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || a.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Activity Log</h1>
          <p className="text-gray-500 dark:text-gray-400">Track all changes and actions across your projects.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={fetchActivities} 
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCcw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <div className="relative">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2"
            >
              <Filter size={16} /> 
              {filterType === 'All' ? 'Filter' : filterType.split('_')[0]}
              <ChevronDown size={14} />
            </Button>
            
            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-lighter border border-gray-100 dark:border-white/5 rounded-xl shadow-xl z-10 overflow-hidden"
                >
                  {activityTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => { setFilterType(type); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold transition-all ${
                        filterType === type 
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Card className="p-2">
        <div className="relative p-2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activities..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 dark:text-white"
          />
        </div>
      </Card>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="p-6">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </Card>
          ))
        ) : filteredActivities.length > 0 ? (
          filteredActivities.map((activity, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={activity._id}
            >
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-dark flex items-center justify-center shrink-0 shadow-inner">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium text-sm">
                          <span className="font-bold">{activity.user?.name}</span> {activity.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                            <Clock size={10} />
                            {new Date(activity.createdAt).toLocaleDateString()} at {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {activity.project && (
                            <div className="px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-bold">
                              {activity.project.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-dark-lighter rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/5">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No activities match your filters</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => {setSearchTerm(''); setFilterType('All');}}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
