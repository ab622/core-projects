import { Link, useRoute } from "wouter";
import { 
  Activity, 
  Route, 
  ArrowRightLeft,
  Settings,
  TrendingUp,
  FileText,
  Shield,
  User
} from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <ArrowRightLeft className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SolidPoint API</h1>
            <p className="text-blue-100 text-sm">API Manager</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {(() => {
          const [isDashboardActive] = useRoute("/");
          return (
            <Link 
              href="/"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isDashboardActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
          );
        })()}
        {(() => {
          const [isEndpointsActive] = useRoute("/endpoints");
          return (
            <Link 
              href="/endpoints"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isEndpointsActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
              }`}
            >
              <Route className="w-5 h-5" />
              <span>Endpoints</span>
            </Link>
          );
        })()}
        {(() => {
          const [isAnalyticsActive] = useRoute("/analytics");
          return (
            <Link 
              href="/analytics"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isAnalyticsActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
          );
        })()}
        {(() => {
          const [isLogsActive] = useRoute("/logs");
          return (
            <Link 
              href="/logs"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isLogsActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Request Logs</span>
            </Link>
          );
        })()}
        {(() => {
          const [isSecurityActive] = useRoute("/security");
          return (
            <Link 
              href="/security"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isSecurityActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Security</span>
            </Link>
          );
        })()}
        {(() => {
          const [isSettingsActive] = useRoute("/settings");
          return (
            <Link 
              href="/settings"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isSettingsActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          );
        })()}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="text-white text-sm" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Abdelrahman Tony</p>
            <p className="text-xs text-gray-600 font-medium">CIAO of Solidpoint.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
}
