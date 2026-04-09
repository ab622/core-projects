import { useState } from 'react';
import { Link, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Activity,
  Route,
  TrendingUp,
  FileText,
  Shield,
  Settings,
  User,
  ArrowRightLeft,
  Menu,
  X,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AppLayout({ children, title, subtitle, actions }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: '/', icon: Activity, label: 'Dashboard' },
    { href: '/endpoints', icon: Route, label: 'Endpoints' },
    { href: '/api-examples', icon: ArrowRightLeft, label: 'API Examples' },
    { href: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { href: '/logs', icon: FileText, label: 'Request Logs' },
    { href: '/security', icon: Shield, label: 'Security' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const [isActive] = useRoute(href);
    
    return (
      <Link
        href={href}
        className={`group flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-blue-500/90 via-indigo-500/90 to-purple-500/90 text-white shadow-xl backdrop-blur-sm'
            : 'text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 dark:hover:from-slate-800/50 dark:hover:to-slate-700/50 hover:backdrop-blur-sm'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
        <span className="font-semibold text-sm tracking-wide">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 z-50 
        transform transition-transform duration-300 ease-in-out
        lg:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl 
        border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col
      `}>
        {/* Header */}
        <div className="p-8 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float will-change-transform">
                <ArrowRightLeft className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">SolidPoint API</h1>
                <p className="text-blue-100 text-sm font-medium">Professional API Manager</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10 rounded-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
          <div className="flex items-center space-x-4 px-5 py-4 bg-gradient-to-r from-slate-50/80 to-blue-50/80 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl backdrop-blur-sm border border-slate-200/30 dark:border-slate-700/30">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="text-white text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">Abdelrahman Tony</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">CIAO of Solidpoint.ai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border-b border-slate-200/30 dark:border-slate-700/30 px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="hidden sm:flex items-center space-x-3 bg-emerald-50 dark:bg-emerald-900/20 px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full animate-pulse-soft shadow-glow"></div>
                <span className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300">System Online</span>
              </div>
              <ThemeToggle />
              {actions}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}