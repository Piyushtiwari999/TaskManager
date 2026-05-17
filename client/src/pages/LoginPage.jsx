import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.isNetworkError 
        ? error.message 
        : (error.response?.data?.message || 'Login failed');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/20 mx-auto mb-4">
            T
          </div>
          <h1 className="text-3xl font-bold dark:text-white">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Enter your credentials to access your account</p>
        </div>

        <Card className="p-8 shadow-xl border-none">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="w-full h-12" 
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-500/10 rounded-lg border border-primary-100 dark:border-primary-500/20">
          <p className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider mb-2">Demo Credentials</p>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p>Admin: <span className="font-mono font-medium">admin@taskflow.com</span> / <span className="font-mono">admin123</span></p>
            <p>Member: <span className="font-mono font-medium">member@taskflow.com</span> / <span className="font-mono">member123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
