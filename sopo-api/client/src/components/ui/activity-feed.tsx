import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { Activity, Filter, Eye, Clock, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import type { RequestLog, Endpoint } from "@/lib/types";

interface ActivityFeedProps {
  logs: RequestLog[];
  endpoints: Endpoint[];
}

export function ActivityFeed({ logs, endpoints }: ActivityFeedProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<RequestLog | null>(null);
  const [displayLimit, setDisplayLimit] = useState(5); // Start with only 5 logs for speed

  // Memoize filtered logs for better performance
  const filteredLogs = useMemo(() => {
    return selectedEndpoint === "all" 
      ? logs 
      : logs.filter(log => log.endpointId === parseInt(selectedEndpoint));
  }, [logs, selectedEndpoint]);

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return "text-green-600 bg-green-50";
    if (statusCode >= 300 && statusCode < 400) return "text-yellow-600 bg-yellow-50";
    if (statusCode >= 400 && statusCode < 500) return "text-orange-600 bg-orange-50";
    if (statusCode >= 500) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const getStatusText = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return `${statusCode} Success`;
    if (statusCode >= 300 && statusCode < 400) return `${statusCode} Redirect`;
    if (statusCode >= 400 && statusCode < 500) return `${statusCode} Client Error`;
    if (statusCode >= 500) return `${statusCode} Server Error`;
    return `${statusCode}`;
  };

  const getEndpointName = (endpointId?: number) => {
    if (!endpointId) return "Unknown";
    const endpoint = endpoints.find(e => e.id === endpointId);
    return endpoint ? endpoint.path : "Deleted Endpoint";
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Request Logs
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by endpoint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Endpoints</SelectItem>
                  {endpoints?.map((endpoint) => (
                    <SelectItem key={endpoint.id} value={endpoint.id.toString()}>
                      {endpoint.path}
                    </SelectItem>
                  )) || []}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {filteredLogs.slice(0, displayLimit).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200"
                   onClick={() => setSelectedLog(log)}>
                <div className="flex items-center space-x-4">
                  <Badge className={`${getStatusColor(log.statusCode)} font-medium px-3 py-1`}>
                    {log.statusCode}
                  </Badge>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center space-x-2">
                      <span className="font-mono text-sm">{log.method}</span>
                      <span>{log.path}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-3">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                      </span>
                      <span>Endpoint: {getEndpointName(log.endpointId)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="font-medium">{log.responseTime}ms</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
                <p className="text-gray-500">
                  {selectedEndpoint === "all" 
                    ? "No requests have been made yet" 
                    : "No requests for this endpoint"}
                </p>
              </div>
            )}
            
            {/* Load More Button */}
            {filteredLogs.length > displayLimit && (
              <div className="text-center pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDisplayLimit(prev => prev + 10)}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  Load More ({filteredLogs.length - displayLimit} remaining)
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      {selectedLog && (
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">Request Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedLog(null)}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Request Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method:</span>
                    <Badge variant="outline">{selectedLog.method}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Path:</span>
                    <span className="font-mono">{selectedLog.path}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <Badge className={getStatusColor(selectedLog.statusCode)}>
                      {selectedLog.statusCode}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Time:</span>
                    <span className="font-medium">{selectedLog.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Client IP:</span>
                    <span className="font-mono">{selectedLog.clientIp || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Request Body</h3>
                <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <pre className="text-xs text-gray-700">
                    {selectedLog.requestBody 
                      ? JSON.stringify(selectedLog.requestBody, null, 2)
                      : 'No request body'}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Response Body</h3>
                <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <pre className="text-xs text-gray-700">
                    {selectedLog.responseBody 
                      ? JSON.stringify(selectedLog.responseBody, null, 2)
                      : 'No response body'}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Headers</h3>
                <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <pre className="text-xs text-gray-700">
                    {selectedLog.headers 
                      ? JSON.stringify(selectedLog.headers, null, 2)
                      : 'No headers'}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}