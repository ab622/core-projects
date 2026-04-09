import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Dashboard from "@/pages/dashboard";
import EndpointsPage from "@/pages/endpoints";
import ApiExamplesPage from "@/pages/api-examples";
import AnalyticsPage from "@/pages/analytics";
import LogsPage from "@/pages/logs";
import SecurityPage from "@/pages/security";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/endpoints" component={EndpointsPage} />
      <Route path="/api-examples" component={ApiExamplesPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/logs" component={LogsPage} />
      <Route path="/security" component={SecurityPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
