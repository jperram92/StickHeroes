import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { queryClient } from "./lib/queryClient";
import { Switch, Route } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";
import AuthPage from "@/pages/auth-page";
import GamePage from "@/pages/game-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={GamePage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
