import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { ApiUsageExamples } from "@/components/api-usage-examples";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, ExternalLink, Play, Zap, BookOpen, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Endpoint } from "@/lib/types";

export default function ApiExamplesPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const { toast } = useToast();

  const { data: endpoints = [] } = useQuery<Endpoint[]>({
    queryKey: ["/api/endpoints"],
    staleTime: 5 * 60 * 1000,
  });

  const activeEndpoints = endpoints.filter(ep => ep.isActive);

  const downloadPostmanCollection = () => {
    const collection = {
      info: {
        name: "SolidPoint API Collection",
        description: "API collection for SolidPoint proxy endpoints",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: endpoints.map(endpoint => ({
        name: `${endpoint.method} ${endpoint.path}`,
        request: {
          method: endpoint.method,
          header: [
            {
              key: "Content-Type",
              value: "application/json"
            },
            ...Object.entries(endpoint.customHeaders || {}).map(([key, value]) => ({
              key,
              value: value as string
            }))
          ],
          url: {
            raw: `${window.location.origin}${endpoint.path}`,
            host: [window.location.hostname],
            port: window.location.port,
            path: endpoint.path.split('/').filter(p => p)
          },
          ...(endpoint.method !== 'GET' && endpoint.defaultPayload && {
            body: {
              mode: "raw",
              raw: JSON.stringify(endpoint.defaultPayload, null, 2)
            }
          })
        }
      }))
    };

    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solidpoint-api-collection.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Collection Downloaded!",
      description: "Postman collection has been downloaded successfully.",
    });
  };

  return (
    <AppLayout
      title="API Usage Examples"
      subtitle="Professional code examples and documentation for all your endpoints"
      actions={
        <div className="flex items-center space-x-3">
          <Button
            onClick={downloadPostmanCollection}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={endpoints.length === 0}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Postman Collection</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Total Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {endpoints.length}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                  <Code className="text-white text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Active Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {activeEndpoints.length}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <Play className="text-white text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Code Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  4
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <BookOpen className="text-white text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Guide */}
        <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 border border-blue-200/50 dark:border-slate-600/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Zap className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quick Start Guide</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">Get started with your API endpoints in seconds</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Available Programming Languages:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                    cURL
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    JavaScript
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Python
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Node.js
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Features:</h4>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Automatic URL generation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Custom headers support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Payload examples included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>One-click testing</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints List with Examples */}
        {endpoints.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">API Endpoints</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Click on any endpoint to view code examples
              </p>
            </div>
            
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <Card key={endpoint.id} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                  <CardContent className="p-6">
                    {selectedEndpoint?.id === endpoint.id ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Badge variant={endpoint.isActive ? 'default' : 'secondary'}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                              {endpoint.path}
                            </code>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEndpoint(null)}
                          >
                            Hide Examples
                          </Button>
                        </div>
                        <ApiUsageExamples endpoint={endpoint} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge 
                            variant={endpoint.isActive ? 'default' : 'secondary'}
                            className={endpoint.method === 'GET' ? 'bg-green-500' :
                              endpoint.method === 'POST' ? 'bg-blue-500' :
                              endpoint.method === 'PUT' ? 'bg-yellow-500' :
                              endpoint.method === 'DELETE' ? 'bg-red-500' : 'bg-gray-500'}
                          >
                            {endpoint.method}
                          </Badge>
                          <div>
                            <code className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-100">
                              {endpoint.path}
                            </code>
                            {endpoint.description && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                {endpoint.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              endpoint.isActive ? 'bg-emerald-500 animate-pulse-soft' : 'bg-slate-400'
                            }`} />
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {endpoint.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {endpoint.targetUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(endpoint.targetUrl, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEndpoint(endpoint)}
                          >
                            <Code className="w-4 h-4 mr-2" />
                            View Examples
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto">
                  <Code className="text-slate-500 dark:text-slate-400 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No Endpoints Available
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Create your first endpoint to see professional code examples and usage documentation.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/endpoints'}
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600"
                  >
                    Create Your First Endpoint
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}