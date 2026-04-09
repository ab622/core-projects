import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { EndpointTable } from "@/components/ui/endpoint-table";
import { ActivityFeed } from "@/components/ui/activity-feed";
import { AddEndpointModal } from "@/components/ui/add-endpoint-modal";
import {
  Plus,
  Route,
  TrendingUp,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";
import type { Endpoint, RequestLog, Stats } from "@/lib/types";

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: endpoints = [], refetch: refetchEndpoints } = useQuery<Endpoint[]>({
    queryKey: ["/api/endpoints"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchInterval: 60000, // Refetch every 60 seconds for endpoints
  });

  const { data: logs = [] } = useQuery<RequestLog[]>({
    queryKey: ["/api/logs"],
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
    refetchInterval: 15000, // Refetch every 15 seconds for logs
  });

  const activeEndpointsCount = endpoints.filter(e => e.isActive).length;

  return (
    <AppLayout
      title="API Proxy Dashboard Manager"
      subtitle="Manage your API endpoints and monitor requests in real-time"
      actions={
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white px-4 sm:px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline font-semibold">Add New Endpoint</span>
          <span className="sm:hidden font-semibold">Add</span>
        </Button>
      }
    >
      <div className="space-y-6 lg:space-y-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200/30 dark:border-slate-700/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 will-change-transform">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Endpoints</p>
                <p className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{stats?.totalEndpoints || 0}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse-soft"></span>
                  {activeEndpointsCount} active
                </p>
              </div>
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 animate-float">
                <Route className="text-white text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200/30 dark:border-slate-700/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 will-change-transform">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Requests Today</p>
                <p className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{stats?.requestsToday || 0}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                  Live tracking
                </p>
              </div>
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 animate-float">
                <TrendingUp className="text-white text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200/30 dark:border-slate-700/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 will-change-transform">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Success Rate</p>
                <p className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{stats?.successRate || 0}%</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                  {stats?.successRate === 100 ? '🎯 Perfect!' : '✅ Good performance'}
                </p>
              </div>
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 animate-float">
                <CheckCircle className="text-white text-xl lg:text-2xl" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200/30 dark:border-slate-700/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 will-change-transform">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Avg Response</p>
                <p className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{stats?.avgResponseTime || 0}ms</p>
                <p className="text-sm font-semibold">
                  {(stats?.avgResponseTime || 0) < 500 ? 
                    <span className="text-green-600 dark:text-green-400">⚡ Fast</span> : 
                    <span className="text-orange-600 dark:text-orange-400">⚠️ Acceptable</span>
                  }
                </p>
              </div>
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 animate-float">
                <Clock className="text-white text-xl lg:text-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {/* Endpoints Table */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 overflow-hidden">
            <EndpointTable 
              endpoints={endpoints} 
              onRefetch={refetchEndpoints}
            />
          </div>

          {/* Activity Feed */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 overflow-hidden">
            <ActivityFeed logs={logs} endpoints={endpoints} />
          </div>
        </div>

        <AddEndpointModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            refetchEndpoints();
          }}
        />
      </div>
    </AppLayout>
  );
}