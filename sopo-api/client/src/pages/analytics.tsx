import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Route, CheckCircle, Clock, Zap, RefreshCw } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const { data: stats, isLoading, error, refetch } = useQuery<{
    totalEndpoints: number;
    requestsToday: number;
    successRate: number;
    avgResponseTime: number;
    requestsOverTime: number[];
    responseTimeBuckets: {
      fast: number;
      medium: number;
      slow: number;
      verySlow: number;
    };
    methodUsage: {
      GET: number;
      POST: number;
      PUT: number;
      DELETE: number;
      PATCH: number;
      HEAD: number;
      OPTIONS: number;
    };
  }>({
    queryKey: ["/api/stats"],
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (stats) {
      console.log('Fetched stats data:', stats);
    }
    if (error) {
      console.error('Error fetching stats:', error);
    }
  }, [stats, error]);

  if (isLoading) {
    return (
      <AppLayout
        title="Analytics & Insights"
        subtitle="Monitor API performance and usage patterns"
        actions={<div></div>}
      >
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Loading analytics data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout
        title="Analytics & Insights"
        subtitle="Monitor API performance and usage patterns"
        actions={<div></div>}
      >
        <div className="flex items-center justify-center py-20">
          <div className="text-center text-red-600">
            <p className="text-lg font-medium">Failed to load analytics data</p>
            <p className="text-sm mt-2">Error: {(error as any)?.message}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Analytics & Insights"
      subtitle="Monitor API performance and usage patterns"
      actions={
        <Button 
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white px-4 sm:px-6 py-3 rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
          onClick={async () => {
            await refetch();
            console.log('Data refreshed successfully');
          }}
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline font-semibold">Refresh Data</span>
        </Button>
      }
    >
      <div className="space-y-6 lg:space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200/30 dark:border-slate-700/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 will-change-transform">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Endpoints</p>
                <p className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{stats?.totalEndpoints || 0}</p>
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-slate-200/30 dark:border-slate-700/30">
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span>Requests Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64">
                <Chart 
                  type="line"
                  data={{
                    labels: stats?.requestsOverTime?.map((_, i) => `${i+1}h`) || [],
                    datasets: [{
                      label: 'Requests',
                      data: stats?.requestsOverTime || [],
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 3,
                      fill: true,
                      tension: 0.4
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Hours',
                          font: { size: 12 }
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Requests',
                          font: { size: 12 }
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-slate-200/30 dark:border-slate-700/30">
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
                <Clock className="w-5 h-5 text-green-500" />
                <span>Response Times</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64">
                <Chart 
                  type="bar"
                  data={{
                    labels: ['Fast\n<200ms', 'Medium\n200-500ms', 'Slow\n500-1000ms', 'Very Slow\n>1000ms'],
                    datasets: [{
                      label: 'Response Times',
                      data: [
                        stats?.responseTimeBuckets?.fast || 0,
                        stats?.responseTimeBuckets?.medium || 0,
                        stats?.responseTimeBuckets?.slow || 0,
                        stats?.responseTimeBuckets?.verySlow || 0
                      ],
                      backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                      ],
                      borderRadius: 8
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Request Count',
                          font: { size: 12 }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden lg:col-span-2 xl:col-span-1">
            <CardHeader className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-slate-200/30 dark:border-slate-700/30">
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span>HTTP Methods</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64">
                <Chart 
                  type="doughnut"
                  data={{
                    labels: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
                    datasets: [{
                      data: [
                        stats?.methodUsage?.GET || 0,
                        stats?.methodUsage?.POST || 0,
                        stats?.methodUsage?.PUT || 0,
                        stats?.methodUsage?.DELETE || 0,
                        stats?.methodUsage?.PATCH || 0,
                        stats?.methodUsage?.HEAD || 0,
                        stats?.methodUsage?.OPTIONS || 0
                      ],
                      backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(107, 114, 128, 0.8)'
                      ],
                      borderWidth: 2,
                      borderColor: 'rgba(255, 255, 255, 0.8)'
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 15,
                          usePointStyle: true,
                          pointStyle: 'circle'
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}