import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  CheckCircle, 
  Clock, 
  Users,
  TrendingUp,
  Activity as ActivityIcon
} from 'lucide-react';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import api from '../services/api';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';

const StatCard = ({ title, value, icon, trend, color, loading }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-current`}>
        {icon}
      </div>
      {trend && !loading && (
        <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
    {loading ? (
      <Skeleton className="h-8 w-20" />
    ) : (
      <p className="text-2xl font-bold dark:text-white">{value}</p>
    )}
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/users/activities')
        ]);
        setStats(statsRes.data);
        setActivities(activitiesRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Projects" 
          value={stats?.projectsCount || 0} 
          icon={<FolderKanban />} 
          color="text-blue-600 bg-blue-600"
          trend="+12%"
          loading={loading}
        />
        <StatCard 
          title="Active Tasks" 
          value={stats?.tasksCount || 0} 
          icon={<Clock />} 
          color="text-amber-600 bg-amber-600"
          trend="+5%"
          loading={loading}
        />
        <StatCard 
          title="Completed Tasks" 
          value={stats?.completedTasks || 0} 
          icon={<CheckCircle />} 
          color="text-green-600 bg-green-600"
          trend="+18%"
          loading={loading}
        />
        <StatCard 
          title="Team Members" 
          value={stats?.membersCount || 0} 
          icon={<Users />} 
          color="text-indigo-600 bg-indigo-600"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
              <TrendingUp size={20} className="text-primary-600" />
              Project Progress
            </h3>
            <div className="h-[300px]">
              {loading ? <Skeleton className="h-full w-full" /> : <DashboardCharts />}
            </div>
          </Card>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-6">
          <Card className="p-6 h-full">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
              <ActivityIcon size={20} className="text-primary-600" />
              Recent Activity
            </h3>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <ActivityTimeline activities={activities} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
