import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Layout as LayoutIcon, 
  Home, 
  BarChart2, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  X,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Team', path: '/team', icon: Users, adminOnly: true },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const filteredNavItems = navItems.filter(item => !item.adminOnly || user?.role === 'Admin');

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark transition-colors duration-200">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-lighter border-r border-gray-200 dark:border-white/5 transition-transform duration-300 transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                <LayoutIcon size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight">TaskFlow<span className="text-primary-600">Pro</span></span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-lightest'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-white/5">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-lightest rounded-xl mb-4">
              <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
        {/* Navbar */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-dark-lighter/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200 dark:border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-gray-100 dark:bg-dark-lightest border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-lightest rounded-full transition-all"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-lightest rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-dark-lighter"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-2"></div>
            <p className="text-sm font-medium hidden sm:block">Welcome, {user?.name.split(' ')[0]} 👋</p>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
