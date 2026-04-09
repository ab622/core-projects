import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Database, 
  Globe, 
  Palette,
  Server,
  Monitor,
  Download,
  Upload,
  Save,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    appName: "SolidPoint API Manager",
    timezone: "UTC",
    language: "en",
    theme: "light",
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    alertOnFailure: true,
    alertOnSlowResponse: true,
    
    // Performance Settings
    cacheEnabled: true,
    cacheDuration: 300,
    compressionEnabled: true,
    logLevel: "info",
    
    // Data Settings
    retentionPeriod: 30,
    autoBackup: true,
    backupFrequency: "daily",
    exportFormat: "json"
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleReset = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to default values.",
      variant: "destructive",
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'api-manager-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Settings Exported",
      description: "Settings file has been downloaded successfully.",
    });
  };

  return (
    <AppLayout
      title="System Settings"
      subtitle="Configure application preferences and system behavior"
      actions={
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline"
            onClick={handleReset}
            className="hidden sm:flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </Button>
          <Button 
            onClick={handleSave}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl lg:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline font-semibold">Save Changes</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6 lg:space-y-8">
        {/* General Settings */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-slate-200/30 dark:border-slate-700/30">
            <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
              <SettingsIcon className="w-5 h-5 text-blue-500" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Application Name</Label>
                <Input
                  value={settings.appName}
                  onChange={(e) => setSettings(prev => ({ ...prev, appName: e.target.value }))}
                  className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}>
                  <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Language</Label>
                <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
                  <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-slate-200/30 dark:border-slate-700/30">
            <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
              <Bell className="w-5 h-5 text-green-500" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Email Notifications</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Receive email alerts for important events</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <Separator className="bg-slate-200/50 dark:bg-slate-700/50" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Push Notifications</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Browser push notifications</p>
                </div>
                <Switch 
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                />
              </div>

              <Separator className="bg-slate-200/50 dark:bg-slate-700/50" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Alert on API Failures</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Get notified when endpoints fail</p>
                </div>
                <Switch 
                  checked={settings.alertOnFailure}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, alertOnFailure: checked }))}
                />
              </div>

              <Separator className="bg-slate-200/50 dark:bg-slate-700/50" />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Alert on Slow Response</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Get notified for slow API responses</p>
                </div>
                <Switch 
                  checked={settings.alertOnSlowResponse}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, alertOnSlowResponse: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance & System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 border-b border-slate-200/30 dark:border-slate-700/30">
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
                <Monitor className="w-5 h-5 text-purple-500" />
                <span>Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Enable Caching</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Cache responses for better performance</p>
                </div>
                <Switch 
                  checked={settings.cacheEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, cacheEnabled: checked }))}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Cache Duration (seconds)</Label>
                <Input
                  type="number"
                  value={settings.cacheDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, cacheDuration: parseInt(e.target.value) }))}
                  className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Response Compression</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Compress responses to reduce bandwidth</p>
                </div>
                <Switch 
                  checked={settings.compressionEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compressionEnabled: checked }))}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Log Level</Label>
                <Select value={settings.logLevel} onValueChange={(value) => setSettings(prev => ({ ...prev, logLevel: value }))}>
                  <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error Only</SelectItem>
                    <SelectItem value="warn">Warnings</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-900/20 dark:to-red-900/20 border-b border-slate-200/30 dark:border-slate-700/30">
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
                <Database className="w-5 h-5 text-orange-500" />
                <span>Data & Backup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Data Retention (days)</Label>
                <Input
                  type="number"
                  value={settings.retentionPeriod}
                  onChange={(e) => setSettings(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) }))}
                  className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <p className="text-xs text-slate-600 dark:text-slate-400">How long to keep request logs</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Auto Backup</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Automatically backup configuration</p>
                </div>
                <Switch 
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBackup: checked }))}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-900 dark:text-slate-100">Backup Frequency</Label>
                <Select value={settings.backupFrequency} onValueChange={(value) => setSettings(prev => ({ ...prev, backupFrequency: value }))}>
                  <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleExport}
                  className="flex-1 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl border border-slate-200/30 dark:border-slate-700/30 rounded-2xl lg:rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50/80 to-gray-50/80 dark:from-slate-800/20 dark:to-slate-900/20 border-b border-slate-200/30 dark:border-slate-700/30">
            <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
              <Server className="w-5 h-5 text-slate-500" />
              <span>System Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Version</Label>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">v1.2.0</p>
                <Badge variant="outline" className="text-xs">Latest</Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Node.js</Label>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">v20.11.0</p>
                <Badge variant="secondary" className="text-xs">LTS</Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Database</Label>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">PostgreSQL</p>
                <Badge variant="default" className="text-xs">Connected</Badge>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Uptime</Label>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">2d 14h 32m</p>
                <Badge variant="secondary" className="text-xs">Stable</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}