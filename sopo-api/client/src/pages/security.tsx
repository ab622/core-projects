import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Key, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  Clock,
  Users,
  Activity,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SecurityPage() {
  const [settings, setSettings] = useState({
    rateLimit: true,
    corsEnabled: true,
    httpsOnly: false,
    apiKeyRequired: false,
    ipWhitelist: "",
    maxRequestsPerMinute: 60,
    enableLogging: true,
    blockSuspiciousRequests: true
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Security settings have been updated successfully.",
    });
  };

  const securityScores = [
    { label: "Rate Limiting", score: settings.rateLimit ? 100 : 0, enabled: settings.rateLimit },
    { label: "CORS Protection", score: settings.corsEnabled ? 100 : 0, enabled: settings.corsEnabled },
    { label: "HTTPS Enforcement", score: settings.httpsOnly ? 100 : 50, enabled: settings.httpsOnly },
    { label: "API Key Protection", score: settings.apiKeyRequired ? 100 : 0, enabled: settings.apiKeyRequired },
  ];

  const overallScore = Math.round(securityScores.reduce((sum, item) => sum + item.score, 0) / securityScores.length);

  return (
    <AppLayout
      title="Security Center"
      subtitle="Configure security settings and monitor threats"
      actions={
        <Button 
          onClick={handleSave}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white px-4 sm:px-6 py-3 rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline font-semibold">Save Settings</span>
        </Button>
      }
    >
      <div className="space-y-6 lg:space-y-8">
        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  overallScore >= 80 ? 'bg-green-100 dark:bg-green-900/20' : 
                  overallScore >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/20' : 
                  'bg-red-100 dark:bg-red-900/20'
                }`}>
                  <Shield className={`w-7 h-7 ${
                    overallScore >= 80 ? 'text-green-600 dark:text-green-400' : 
                    overallScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                    'text-red-600 dark:text-red-400'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Security Score</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{overallScore}%</p>
                  <Badge variant={overallScore >= 80 ? "default" : overallScore >= 60 ? "secondary" : "destructive"} className="mt-1">
                    {overallScore >= 80 ? "Excellent" : overallScore >= 60 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Blocked Requests</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">24</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Last 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unique IPs</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">127</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center">
                  <Activity className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Threat Level</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">Low</p>
                  <div className="flex items-center mt-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500 mr-1" />
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">All Clear</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-slate-200/30 dark:border-slate-700/30">
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
                <Lock className="w-5 h-5 text-blue-500" />
                <span>Access Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Rate Limiting</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Limit requests per minute</p>
                </div>
                <Switch 
                  checked={settings.rateLimit}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, rateLimit: checked }))}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Max Requests per Minute</Label>
                <Input
                  type="number"
                  value={settings.maxRequestsPerMinute}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxRequestsPerMinute: parseInt(e.target.value) }))}
                  className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">CORS Protection</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Cross-Origin Resource Sharing</p>
                </div>
                <Switch 
                  checked={settings.corsEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, corsEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">HTTPS Only</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Redirect HTTP to HTTPS</p>
                </div>
                <Switch 
                  checked={settings.httpsOnly}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, httpsOnly: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-slate-200/30 dark:border-slate-700/30">
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
                <Key className="w-5 h-5 text-green-500" />
                <span>Authentication</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">API Key Required</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Require API key for access</p>
                </div>
                <Switch 
                  checked={settings.apiKeyRequired}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, apiKeyRequired: checked }))}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">IP Whitelist</Label>
                <Input
                  placeholder="192.168.1.1, 10.0.0.0/8"
                  value={settings.ipWhitelist}
                  onChange={(e) => setSettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
                  className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
                <p className="text-xs text-slate-600 dark:text-slate-400">Comma-separated IPs or CIDR blocks</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Block Suspicious Requests</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Auto-block malicious patterns</p>
                </div>
                <Switch 
                  checked={settings.blockSuspiciousRequests}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, blockSuspiciousRequests: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Checklist */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-slate-200/30 dark:border-slate-700/30">
            <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
              <AlertTriangle className="w-5 h-5 text-purple-500" />
              <span>Security Checklist</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityScores.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {item.enabled ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    )}
                    <span className="font-medium text-slate-900 dark:text-slate-100">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          item.score >= 80 ? 'bg-green-500' : 
                          item.score >= 60 ? 'bg-yellow-500' : 
                          item.score > 0 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-10 text-right">
                      {item.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}