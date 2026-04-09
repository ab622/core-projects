import { useQuery } from "@tanstack/react-query";
import { EndpointTable } from "@/components/ui/endpoint-table";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Code, Eye } from "lucide-react";
import { AddEndpointModal } from "@/components/ui/add-endpoint-modal";
import { ApiUsageExamples } from "@/components/api-usage-examples";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import type { Endpoint } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/app-layout";
import { useToast } from "@/hooks/use-toast";

export default function EndpointsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const { toast } = useToast();

  const { data: endpoints = [], refetch } = useQuery<Endpoint[]>({
    queryKey: ["/api/endpoints"],
    staleTime: 5 * 60 * 1000,
  });

  const copyToClipboard = async () => {
    const codeExample = `// Using your SolidPoint API proxy
const response = await fetch('${window.location.origin}/psummarize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    object_url_type: "Youtube",
    object_url: "https://youtube.com/watch?v=..."
  }),
});

const result = await response.json();
console.log(result);`;

    try {
      await navigator.clipboard.writeText(codeExample);
      toast({
        title: "Code copied!",
        description: "API usage example has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the code manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppLayout
      title="Endpoints Management"
      subtitle="Create, manage, and monitor your API endpoints"
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
      <div className="space-y-6 lg:space-y-8">
        {/* API Usage Examples Section */}
        {endpoints.length > 0 && (
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-float">
                    <Code className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">API Usage Examples</h3>
                    <p className="text-slate-600 dark:text-slate-400">Professional code examples for your endpoints</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{endpoints.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Endpoints</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {endpoints.map((endpoint) => (
                  <Dialog key={endpoint.id}>
                    <DialogTrigger asChild>
                      <Card className="cursor-pointer group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200/50 dark:border-slate-600/50">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                  endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                  endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                  endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                }`}>
                                  {endpoint.method}
                                </span>
                              </div>
                              <Eye className="w-4 h-4 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            
                            <div>
                              <p className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {endpoint.path}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">
                                {endpoint.description || 'No description'}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center space-x-1 text-xs font-semibold ${
                                endpoint.isActive 
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  endpoint.isActive ? 'bg-emerald-500 animate-pulse-soft' : 'bg-slate-400'
                                }`} />
                                {endpoint.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEndpoint(endpoint);
                                }}
                              >
                                <Code className="w-3 h-3 mr-1" />
                                View Code
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                          API Usage Examples - {endpoint.method} {endpoint.path}
                        </DialogTitle>
                      </DialogHeader>
                      <ApiUsageExamples endpoint={endpoint} />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Endpoints Table */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 overflow-hidden">
          <EndpointTable endpoints={endpoints} onRefetch={refetch} />
        </div>

        <AddEndpointModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            refetch();
          }}
        />
      </div>
    </AppLayout>
  );
}
