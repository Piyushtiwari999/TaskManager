import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  CheckCircle, 
  MessageSquare, 
  PlusCircle, 
  RefreshCcw,
  Trash2
} from 'lucide-react';

const icons = {
  PROJECT_CREATED: <PlusCircle className="text-blue-500" size={16} />,
  TASK_ASSIGNED: <CheckCircle className="text-green-500" size={16} />,
  TASK_UPDATED: <RefreshCcw className="text-amber-500" size={16} />,
  COMMENT_ADDED: <MessageSquare className="text-indigo-500" size={16} />,
  PROJECT_DELETED: <Trash2 className="text-red-500" size={16} />,
};

const ActivityTimeline = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
        <ActivityIcon size={40} className="mb-4 opacity-20" />
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <div key={activity._id} className="flex gap-4 relative">
          {index !== activities.length - 1 && (
            <div className="absolute left-[17px] top-8 bottom-[-24px] w-0.5 bg-gray-100 dark:bg-white/5" />
          )}
          
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white dark:bg-dark-lightest border border-gray-100 dark:border-white/5 flex items-center justify-center z-10 shadow-sm">
            {icons[activity.type] || <RefreshCcw size={16} />}
          </div>

          <div className="flex-1 pt-1 pb-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              <span className="font-bold">{activity.user?.name}</span>{' '}
              {activity.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </span>
              {activity.project && (
                <>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                    {activity.project?.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Need to import Activity icon for the empty state
import { Activity as ActivityIcon } from 'lucide-react';

export default ActivityTimeline;
