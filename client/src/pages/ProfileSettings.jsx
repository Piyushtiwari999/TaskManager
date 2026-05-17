import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Camera, Save, Bell, Shield, Palette, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    currentPassword: '',
    newPassword: '',
    notifications: {
      email: true,
      browser: true,
      updates: false
    },
    theme: 'dark'
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
      };

      if (activeTab === 'security' && formData.newPassword) {
        payload.password = formData.newPassword;
      }

      const { data } = await api.put('/auth/profile', payload);
      
      // Update global auth context
      localStorage.setItem('token', data.token);
      updateUser({
        name: data.name,
        email: data.email,
        avatar: data.avatar
      });
      
      toast.success('Profile updated successfully!');
      if (payload.password) setFormData({ ...formData, newPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Profile Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your account preferences and security.</p>
        </div>
        <div className="text-sm px-4 py-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg font-semibold border border-primary-100 dark:border-primary-500/20">
          Role: {user?.role}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSave} className="space-y-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <Card className="p-8">
                      <h3 className="text-lg font-bold mb-6 dark:text-white">Profile Picture</h3>
                      <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="relative group">
                          <img 
                            src={formData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
                            className="w-32 h-32 rounded-3xl object-cover ring-4 ring-gray-100 dark:ring-white/5 bg-white" 
                          />
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white"
                          >
                            <Camera size={32} />
                          </button>
                        </div>
                        <div className="space-y-4 text-center sm:text-left">
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                            <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>Upload New</Button>
                            <Button type="button" variant="secondary" size="sm" onClick={() => setFormData({...formData, avatar: ''})}>Remove</Button>
                          </div>
                          <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-8 space-y-6">
                      <h3 className="text-lg font-bold dark:text-white">Account Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Full Name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          icon={<User size={18} />}
                        />
                        <Input
                          label="Email Address"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          icon={<Mail size={18} />}
                        />
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === 'security' && (
                  <Card className="p-8 space-y-6">
                    <h3 className="text-lg font-bold dark:text-white">Password Settings</h3>
                    <div className="max-w-md space-y-4">
                      <div className="relative">
                        <Input
                          label="New Password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 italic">Leave blank if you don't want to change password.</p>
                    </div>
                  </Card>
                )}

                {activeTab === 'notifications' && (
                  <Card className="p-8 space-y-6">
                    <h3 className="text-lg font-bold dark:text-white">Email Preferences</h3>
                    <div className="space-y-4">
                      {[
                        { id: 'email', label: 'Email Notifications', desc: 'Receive daily summary of your tasks.' },
                        { id: 'browser', label: 'Browser Notifications', desc: 'Instant alerts when someone assigns you a task.' },
                        { id: 'updates', label: 'Product Updates', desc: 'Be the first to know about new features.' },
                      ].map((n) => (
                        <div key={n.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                          <div>
                            <p className="font-bold text-sm dark:text-white">{n.label}</p>
                            <p className="text-xs text-gray-500">{n.desc}</p>
                          </div>
                          <div 
                            onClick={() => setFormData({...formData, notifications: {...formData.notifications, [n.id]: !formData.notifications[n.id]}})}
                            className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${formData.notifications[n.id] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.notifications[n.id] ? 'left-7' : 'left-1'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {activeTab === 'appearance' && (
                  <Card className="p-8 space-y-6">
                    <h3 className="text-lg font-bold dark:text-white">Theme Customization</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['light', 'dark'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({...formData, theme: t})}
                          className={`p-4 rounded-2xl border-2 transition-all text-center ${
                            formData.theme === t 
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-500/10' 
                            : 'border-transparent bg-gray-50 dark:bg-white/5'
                          }`}
                        >
                          <div className={`w-full h-20 rounded-lg mb-3 ${t === 'dark' ? 'bg-dark' : 'bg-white shadow-inner'}`} />
                          <span className="font-bold capitalize dark:text-white">{t} Mode</span>
                        </button>
                      ))}
                    </div>
                  </Card>
                )}

                <div className="flex justify-end pt-4">
                  <Button type="submit" isLoading={loading} className="px-10">
                    <Save size={20} /> Save All Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
