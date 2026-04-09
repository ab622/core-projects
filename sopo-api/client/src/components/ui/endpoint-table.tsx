import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Play, Trash2, Route } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EditEndpointModal } from "./edit-endpoint-modal";
import { useState } from "react";
import type { Endpoint } from "@/lib/types";

interface EndpointTableProps {
  endpoints: Endpoint[];
  onRefetch: () => void;
}

export function EndpointTable({ endpoints, onRefetch }: EndpointTableProps) {
  const { toast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/endpoints/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Endpoint deleted successfully",
      });
      onRefetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete endpoint",
        variant: "destructive",
      });
    },
  });

  const testEndpoint = async (endpoint: Endpoint) => {
    try {
      const response = await fetch(endpoint.path, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: endpoint.method !== 'GET' ? JSON.stringify({ test: true }) : undefined,
      });
      
      toast({
        title: "Test Result",
        description: `Status: ${response.status} ${response.statusText}`,
        variant: response.ok ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not connect to endpoint",
        variant: "destructive",
      });
    }
  };

  const handleEditEndpoint = (endpoint: Endpoint) => {
    setEditingEndpoint(endpoint);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    onRefetch();
    setEditModalOpen(false);
    setEditingEndpoint(null);
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-purple-100 text-purple-800';
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const activeCount = endpoints.filter(e => e.isActive).length;

  return (
    <>
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">API Endpoints</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800 px-3 py-1">{activeCount} Active</Badge>
            <Badge variant="secondary" className="px-3 py-1">{endpoints.length} Total</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Endpoint
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Target URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {endpoints.map((endpoint) => (
                <tr key={endpoint.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xs">{endpoint.path.substring(1, 3).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-mono text-sm font-medium text-gray-900">{endpoint.path}</div>
                        <div className="text-xs text-gray-500 mt-1">{endpoint.description || 'No description'}</div>
                        {endpoint.defaultPayload && (
                          <div className="text-xs text-blue-600 font-medium mt-1">Has default payload</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <Badge className={`${getMethodColor(endpoint.method)} font-medium px-3 py-1`}>
                      {endpoint.method}
                    </Badge>
                  </td>
                  <td className="px-6 py-6">
                    <div className="font-mono text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg max-w-xs truncate">
                      {endpoint.targetUrl.replace(/https?:\/\//, '').substring(0, 35)}...
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <Badge className={`${getStatusColor(endpoint.isActive)} px-3 py-1`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        endpoint.isActive ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                      }`}></div>
                      {endpoint.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:bg-blue-50 rounded-xl"
                        onClick={() => handleEditEndpoint(endpoint)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-green-600 hover:bg-green-50 rounded-xl"
                        onClick={() => testEndpoint(endpoint)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:bg-red-50 rounded-xl"
                        onClick={() => deleteMutation.mutate(endpoint.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {endpoints.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Route className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No endpoints configured</h3>
                      <p className="text-gray-500">Get started by adding your first API endpoint</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

      <EditEndpointModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        endpoint={editingEndpoint}
      />
    </>
  );
}
