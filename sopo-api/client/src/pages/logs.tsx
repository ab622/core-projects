import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityFeed } from "@/components/ui/activity-feed";
import type { Endpoint, RequestLog } from "@/lib/types";
import { AppLayout } from "@/components/layout/app-layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const { data: endpoints = [] } = useQuery<Endpoint[]>({
    queryKey: ["/api/endpoints"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: logs = [], refetch } = useQuery<RequestLog[]>({
    queryKey: ["/api/logs"],
    staleTime: 1 * 60 * 1000,
    refetchInterval: 15000,
  });

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.statusCode.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "2xx" && log.statusCode >= 200 && log.statusCode < 300) ||
                         (statusFilter === "4xx" && log.statusCode >= 400 && log.statusCode < 500) ||
                         (statusFilter === "5xx" && log.statusCode >= 500);
    
    const matchesMethod = methodFilter === "all" || 
                         log.method.toLowerCase() === methodFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <AppLayout
      title="Request Logs"
      subtitle="Monitor and analyze API request logs in real-time"
      actions={
        <Button 
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
          onClick={() => refetch()}
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline font-semibold">Refresh</span>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search logs by path, method, or status..."
                className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full sm:w-32 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="2xx">2xx Success</SelectItem>
                  <SelectItem value="4xx">4xx Client Error</SelectItem>
                  <SelectItem value="5xx">5xx Server Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{logs.length}</div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Logs</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">{logs.filter(l => l.statusCode >= 200 && l.statusCode < 300).length}</div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Success (2xx)</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">{logs.filter(l => l.statusCode >= 400 && l.statusCode < 500).length}</div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Client Error (4xx)</div>
            </div>
            <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">{logs.filter(l => l.statusCode >= 500).length}</div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Server Error (5xx)</div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 overflow-hidden">
          <ActivityFeed 
            logs={filteredLogs}
            endpoints={endpoints}
          />
        </div>
      </div>
    </AppLayout>
  );
}
