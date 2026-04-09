import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Code, Play, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Endpoint } from '@/lib/types';

interface ApiUsageExamplesProps {
  endpoint: Endpoint;
  baseUrl?: string;
}

export function ApiUsageExamples({ endpoint, baseUrl = window.location.origin }: ApiUsageExamplesProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('curl');

  const fullUrl = `${baseUrl}${endpoint.path}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: 'Code example has been copied successfully.',
    });
  };

  const testEndpoint = async () => {
    try {
      const response = await fetch(fullUrl, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          ...endpoint.customHeaders
        },
        body: endpoint.method !== 'GET' ? JSON.stringify(endpoint.defaultPayload || {}) : undefined
      });
      
      toast({
        title: response.ok ? 'Success!' : 'Request Failed',
        description: `${endpoint.method} ${fullUrl} - Status: ${response.status}`,
        variant: response.ok ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to test endpoint',
        variant: 'destructive'
      });
    }
  };

  const generateCurlExample = () => {
    let curl = `curl -X ${endpoint.method} "${fullUrl}"`;
    
    if (endpoint.customHeaders && Object.keys(endpoint.customHeaders).length > 0) {
      Object.entries(endpoint.customHeaders).forEach(([key, value]) => {
        curl += ` \\\n  -H "${key}: ${value}"`;
      });
    }

    if (endpoint.method !== 'GET' && endpoint.defaultPayload) {
      curl += ` \\\n  -H "Content-Type: application/json"`;
      curl += ` \\\n  -d '${JSON.stringify(endpoint.defaultPayload, null, 2)}'`;
    }

    return curl;
  };

  const generateJavaScriptExample = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...endpoint.customHeaders
    };

    const fetchOptions = {
      method: endpoint.method,
      headers,
      ...(endpoint.method !== 'GET' && endpoint.defaultPayload && {
        body: JSON.stringify(endpoint.defaultPayload, null, 2)
      })
    };

    return `// Using fetch API
const response = await fetch('${fullUrl}', ${JSON.stringify(fetchOptions, null, 2)});
const data = await response.json();
console.log(data);

// Using axios (if installed)
import axios from 'axios';

const { data } = await axios.${endpoint.method.toLowerCase()}('${fullUrl}'${
  endpoint.method !== 'GET' && endpoint.defaultPayload 
    ? `, ${JSON.stringify(endpoint.defaultPayload, null, 2)}`
    : ''
}${Object.keys(headers).length > 0 ? `, {
  headers: ${JSON.stringify(headers, null, 4)}
}` : ''});`;
  };

  const generatePythonExample = () => {
    let python = `import requests
import json

url = "${fullUrl}"`;

    if (endpoint.customHeaders && Object.keys(endpoint.customHeaders).length > 0) {
      python += `\nheaders = ${JSON.stringify({
        'Content-Type': 'application/json',
        ...endpoint.customHeaders
      }, null, 4)}`;
    } else {
      python += `\nheaders = {"Content-Type": "application/json"}`;
    }

    if (endpoint.method !== 'GET' && endpoint.defaultPayload) {
      python += `\npayload = ${JSON.stringify(endpoint.defaultPayload, null, 4)}`;
      python += `\n\nresponse = requests.${endpoint.method.toLowerCase()}(url, headers=headers, json=payload)`;
    } else {
      python += `\n\nresponse = requests.${endpoint.method.toLowerCase()}(url, headers=headers)`;
    }

    python += `\nprint(f"Status: {response.status_code}")
print(f"Response: {response.json()}")`;

    return python;
  };

  const generateNodeExample = () => {
    return `// Using Node.js with http module
const http = require('${endpoint.targetUrl.startsWith('https') ? 'https' : 'http'}');

const options = {
  hostname: '${new URL(fullUrl).hostname}',
  port: ${new URL(fullUrl).port || (fullUrl.startsWith('https') ? 443 : 80)},
  path: '${new URL(fullUrl).pathname}',
  method: '${endpoint.method}',
  headers: {
    'Content-Type': 'application/json',${
      endpoint.customHeaders ? 
      Object.entries(endpoint.customHeaders).map(([k, v]) => `\n    '${k}': '${v}',`).join('') 
      : ''
    }
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.parse(data));
  });
});

${endpoint.method !== 'GET' && endpoint.defaultPayload ? 
`req.write(JSON.stringify(${JSON.stringify(endpoint.defaultPayload, null, 2)}));` : ''}
req.end();`;
  };

  const codeExamples = {
    curl: {
      label: 'cURL',
      language: 'bash',
      code: generateCurlExample()
    },
    javascript: {
      label: 'JavaScript',
      language: 'javascript',
      code: generateJavaScriptExample()
    },
    python: {
      label: 'Python',
      language: 'python',
      code: generatePythonExample()
    },
    nodejs: {
      label: 'Node.js',
      language: 'javascript',
      code: generateNodeExample()
    }
  };

  return (
    <Card className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Code className="text-white text-lg" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">API Usage Examples</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                {endpoint.method} {endpoint.path}
              </p>
            </div>
          </CardTitle>
          <div className="flex items-center space-x-3">
            <Badge variant={endpoint.isActive ? 'default' : 'secondary'} className="px-3 py-1">
              {endpoint.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Button
              onClick={testEndpoint}
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              disabled={!endpoint.isActive}
            >
              <Play className="w-4 h-4 mr-2" />
              Test
            </Button>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Endpoint URL:</p>
              <code className="text-sm text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                {fullUrl}
              </code>
            </div>
            <Button
              onClick={() => copyToClipboard(fullUrl)}
              size="sm"
              variant="ghost"
              className="ml-2"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800">
            {Object.entries(codeExamples).map(([key, example]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="text-xs sm:text-sm font-semibold"
              >
                {example.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(codeExamples).map(([key, example]) => (
            <TabsContent key={key} value={key} className="mt-6">
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {example.label} Example
                    </span>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(example.code)}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                
                <div className="relative bg-slate-900 dark:bg-slate-950 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-800 dark:bg-slate-900 border-b border-slate-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {example.language}
                    </span>
                  </div>
                  
                  <pre className="p-4 text-sm text-slate-100 overflow-x-auto">
                    <code className={`language-${example.language}`}>
                      {example.code}
                    </code>
                  </pre>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {endpoint.targetUrl && (
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-start space-x-3">
              <ExternalLink className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Target URL</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  This endpoint proxies requests to: 
                  <code className="ml-1 font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">
                    {endpoint.targetUrl}
                  </code>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}