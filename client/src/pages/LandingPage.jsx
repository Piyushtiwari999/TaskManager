import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  ArrowRight, 
  LayoutDashboard, 
  Shield, 
  Zap,
  Github
} from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark selection:bg-primary-100 selection:text-primary-900 transition-colors">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
            T
          </div>
          <span className="text-2xl font-bold tracking-tight dark:text-white">TaskFlow Pro</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Login</Link>
          <Link to="/register">
            <Button>Get Started Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <div>
          <span className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 text-sm font-semibold mb-6 inline-block">
            New: Kanban 2.0 is here 🚀
          </span>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
            Management made <br />
            <span className="text-primary-600">effortless.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one workspace for teams. Plan, track, and collaborate on any project with the tool built for modern software teams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="px-10 h-14 text-lg">
                Start Free Trial <ArrowRight size={20} />
              </Button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Button variant="secondary" size="lg" className="px-10 h-14 text-lg">
                <Github size={20} /> Star on GitHub
              </Button>
            </a>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-primary-500/20 blur-[120px] rounded-full -z-10" />
          <div className="rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl shadow-primary-500/10 bg-white dark:bg-dark-lighter">
            <img 
              src="https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=2000" 
              alt="Dashboard Preview" 
              className="w-full opacity-90 dark:opacity-70"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-dark-lighter py-32 transition-colors">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Everything you need to ship faster</h2>
            <p className="text-gray-600 dark:text-gray-400">TaskFlow Pro comes with powerful features out of the box.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <LayoutDashboard className="text-primary-600" />, title: 'Kanban Boards', desc: 'Drag-and-drop task management inspired by the best tools.' },
              { icon: <Shield className="text-primary-600" />, title: 'Role-based Access', desc: 'Secure your projects with granular Admin and Member roles.' },
              { icon: <Zap className="text-primary-600" />, title: 'Real-time Updates', desc: 'Stay in sync with your team with instant UI updates and notifications.' },
            ].map((f, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white dark:bg-dark border border-gray-100 dark:border-white/5 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 dark:border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2026 TaskFlow Pro Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
