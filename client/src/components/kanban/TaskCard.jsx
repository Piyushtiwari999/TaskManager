import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, MessageSquare, Paperclip, MoreVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';

const TaskCard = ({ task, isOverlay, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task._id });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isOverlay ? 'grabbing' : 'grab',
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        className={`p-4 relative ${isOverlay ? 'shadow-2xl ring-2 ring-primary-500 ring-opacity-50' : 'shadow-sm hover:shadow-md'}`}
        hover={!isDragging}
      >
        <div className="flex justify-between items-start mb-3">
          <div className={`w-10 h-1 rounded-full ${getPriorityColor(task.priority)}`} />
          <div className="relative" ref={menuRef}>
            <button 
              onMouseDown={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
            >
              <MoreVertical size={14} />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-dark-lighter border border-gray-100 dark:border-white/5 rounded-xl shadow-xl z-10 overflow-hidden"
                >
                  <button
                    onMouseDown={(e) => { 
                      e.stopPropagation(); 
                      setShowMenu(false);
                      onDelete(); 
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm">
          {task.title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 text-xs">
          {task.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-white/5">
          <div className="flex -space-x-2">
            {task.assignedTo ? (
              <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-500/20 border-2 border-white dark:border-dark-lighter flex items-center justify-center text-[10px] font-bold text-primary-600 uppercase">
                {task.assignedTo.name?.charAt(0)}
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/5 border-2 border-white dark:border-dark-lighter flex items-center justify-center text-[10px] text-gray-400">
                ?
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            {task.comments?.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-medium">
                <MessageSquare size={12} />
                {task.comments.length}
              </div>
            )}
            <div className="flex items-center gap-1 text-[11px] font-medium">
              <Calendar size={12} />
              {task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskCard;
