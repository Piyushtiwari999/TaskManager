import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  DndContext, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Plus, Search, Filter, MoreHorizontal, RefreshCcw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import api from '../services/api';
import socket from '../services/socket';
import KanbanColumn from '../components/kanban/KanbanColumn';
import TaskCard from '../components/kanban/TaskCard';
import Button from '../components/ui/Button';
import AddTaskModal from '../components/kanban/AddTaskModal';

const COLUMNS = [
  { id: 'Todo', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Completed', title: 'Completed' }
];

const TaskBoard = () => {
  const { id: projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchProjectAndTasks();

    if (projectId) {
      socket.connect();
      socket.emit('join_project', projectId);

      socket.on('task_created', (newTask) => {
        setTasks(prev => [...prev, newTask]);
      });

      socket.on('task_updated', (updatedTask) => {
        setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
      });

      return () => {
        socket.off('task_created');
        socket.off('task_updated');
        socket.disconnect();
      };
    }
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    setRefreshing(true);
    try {
      const [projRes, tasksRes] = await Promise.all([
        projectId ? api.get(`/projects/${projectId}`) : Promise.resolve({ data: { name: 'All Tasks' } }),
        projectId ? api.get(`/tasks/project/${projectId}`) : api.get('/tasks')
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
      if (!loading) toast.success('Board updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to load board');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find(t => t._id === activeId);
    let newStatus = overId;
    if (!COLUMNS.find(c => c.id === overId)) {
      const overTask = tasks.find(t => t._id === overId);
      newStatus = overTask.status;
    }

    if (activeTask.status !== newStatus) {
      try {
        const updatedTasks = tasks.map(t => 
          t._id === activeId ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks);
        await api.put(`/tasks/${activeId}`, { status: newStatus });
      } catch (error) {
        toast.error('Failed to update task');
        fetchProjectAndTasks();
      }
    }
    setActiveTask(null);
  };

  const handleAddTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      setIsModalOpen(false);
      fetchProjectAndTasks(); // Fallback for real-time
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(t => 
    filterPriority === 'All' || t.priority === filterPriority
  );

  if (loading) return <div className="h-96 flex items-center justify-center dark:text-white font-medium">Loading board...</div>;

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">{project?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">Kanban Board • {filteredTasks.length} tasks</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={fetchProjectAndTasks}
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
              {filterPriority === 'All' ? 'Filter' : filterPriority}
              <ChevronDown size={14} />
            </Button>
            
            <AnimatePresence>
              {showFilterDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-lighter border border-gray-100 dark:border-white/5 rounded-xl shadow-xl z-20 overflow-hidden"
                >
                  {['All', 'High', 'Medium', 'Low'].map(p => (
                    <button
                      key={p}
                      onClick={() => { setFilterPriority(p); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold transition-all ${
                        filterPriority === p 
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {p} Priority
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {projectId && (
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> Add Task
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full min-w-max">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={filteredTasks.filter(t => t.status === col.id)}
                onAddTask={() => setIsModalOpen(true)}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: { opacity: '0.5' },
              },
            }),
          }}>
            {activeTask ? (
              <TaskCard task={activeTask} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
        projectId={projectId}
      />
    </div>
  );
};

export default TaskBoard;
