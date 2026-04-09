import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TaskCard } from "@/components/TaskCard";
import { Calendar } from "@/components/Calendar";
import { FocusMode } from "@/components/FocusMode";
import { useTheme } from "@/components/ThemeProvider";
import { 
  Search, 
  Plus, 
  Bell, 
  Settings, 
  Sun, 
  Moon, 
  CheckCircle, 
  Clock,
  Home,
  ListTodo,
  Calendar as CalendarIcon,
  BarChart3,
  Tag,
  User,
  LogOut
} from "lucide-react";
import type { Task, Category } from "@shared/schema";

// Mock user data for development
const mockUser = {
  firstName: "Ahmed",
  lastName: "Mohamed",
  email: "ahmed@example.com",
  profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=40&h=40&fit=crop&crop=face"
};

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const [focusModeOpen, setFocusModeOpen] = useState(false);

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["/api/tasks"],
    retry: false,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/stats"],
    retry: false,
  });

  const taskList = tasks as Task[];
  const categoryList = categories as Category[];
  
  const todayTasks = taskList.filter((task) => {
    const today = new Date().toISOString().split('T')[0];
    return task.scheduledDate === today || (!task.scheduledDate && !task.isCompleted);
  });

  const completedTasks = todayTasks.filter((task) => task.isCompleted);
  const pendingTasks = todayTasks.filter((task) => !task.isCompleted);
  const completionRate = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        {/* Logo and User Profile */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">TaskFlow</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <img 
              src={mockUser.profileImageUrl} 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-sm">
                {mockUser.firstName} {mockUser.lastName}
              </p>
              <p className="text-xs text-slate-500">{mockUser.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <ListTodo className="w-5 h-5" />
                <span>Tasks</span>
                <Badge variant="secondary" className="ml-auto">
                  {pendingTasks.length}
                </Badge>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <CalendarIcon className="w-5 h-5" />
                <span>Calendar</span>
              </a>
            </li>
            <li>
              <button 
                onClick={() => setFocusModeOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Clock className="w-5 h-5" />
                <span>Focus Mode</span>
              </button>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </a>
            </li>
          </ul>

          {/* Categories */}
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">Categories</h3>
            <ul className="space-y-2">
              {categoryList.map((category) => (
                <li key={category.id}>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                    <span className="ml-auto text-xs text-slate-500">
                      {taskList.filter((task) => task.categoryId === category.id).length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Settings and Dark Mode Toggle */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log("Profile")}
            className="w-full flex items-center gap-2 text-slate-600 dark:text-slate-400 mt-2"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Welcome {mockUser.firstName || 'User'}, you have {pendingTasks.length} tasks to complete today
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
              
              {/* Quick Actions */}
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                <span>New Task</span>
              </Button>
              
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Tasks Section */}
            <div className="lg:col-span-5 space-y-6">
              {/* Today's Tasks */}
              <Card className="bg-white dark:bg-slate-800">
                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Today's Tasks</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {completedTasks.length} of {todayTasks.length}
                      </span>
                      <Progress value={completionRate} className="w-16" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {tasksLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : todayTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <ListTodo className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">No tasks for today</p>
                    </div>
                  ) : (
                    todayTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="text-green-600 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {stats?.completedTasks || 0}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Completed Tasks</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white dark:bg-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Clock className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {Math.round((stats?.totalFocusTime || 0) / 60 * 10) / 10}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Focus Hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="lg:col-span-7 space-y-6">
              {/* Focus Mode Card */}
              <FocusMode 
                isOpen={focusModeOpen} 
                onClose={() => setFocusModeOpen(!focusModeOpen)} 
              />

              {/* Weekly Calendar */}
              <Calendar tasks={taskList} />

              {/* Analytics Overview */}
              <Card className="bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 relative">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="28" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            fill="transparent" 
                            className="text-slate-200 dark:text-slate-700"
                          />
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="28" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            fill="transparent" 
                            strokeDasharray="175.93" 
                            strokeDashoffset={175.93 - (175.93 * (stats?.completionRate || 0) / 100)}
                            className="text-green-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">
                            {stats?.completionRate || 0}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 relative">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="28" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            fill="transparent" 
                            className="text-slate-200 dark:text-slate-700"
                          />
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="28" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            fill="transparent" 
                            strokeDasharray="175.93" 
                            strokeDashoffset={105}
                            className="text-blue-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">60%</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Time Utilization</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 relative">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="28" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            fill="transparent" 
                            className="text-slate-200 dark:text-slate-700"
                          />
                          <circle 
                            cx="32" 
                            cy="32" 
                            r="28" 
                            stroke="currentColor" 
                            strokeWidth="4" 
                            fill="transparent" 
                            strokeDasharray="175.93" 
                            strokeDashoffset={140}
                            className="text-purple-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">20%</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Focus Mode</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
