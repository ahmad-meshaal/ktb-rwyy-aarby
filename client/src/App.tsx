import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

// Pages
import Home from "@/pages/Home";
import Wizard from "@/pages/Wizard";
import Dashboard from "@/pages/Dashboard";
import Planner from "@/pages/Planner";
import Editor from "@/pages/Editor";
import Characters from "@/pages/Characters";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/novels/new" component={Wizard} />
      <Route path="/novels/:id" component={Dashboard} />
      <Route path="/novels/:id/planner" component={Planner} />
      <Route path="/novels/:id/characters" component={Characters} />
      {/* <Route path="/novels/:id/settings" component={Settings} /> */}
      <Route path="/novels/:novelId/chapters/:chapterId" component={Editor} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Enforce RTL
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
