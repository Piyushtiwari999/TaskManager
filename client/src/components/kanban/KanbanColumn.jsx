import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { MoreHorizontal, Plus } from 'lucide-react';

const KanbanColumn = ({ id, title, tasks, onAddTask, onDeleteTask }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-80 h-full bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <span className="px-2 py-0.5 bg-gray-200 dark:bg-white/10 rounded-full text-xs font-bold text-gray-500 dark:text-gray-400">
            {tasks.length}
          </span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddTask(); }}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 transition-colors"
          >
            <Plus size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-500 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto min-h-[200px]"
      >
        <SortableContext 
          items={tasks.map(t => t._id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onDelete={() => onDeleteTask(task._id)} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-xl flex items-center justify-center p-10 text-gray-400 text-sm">
            No tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
