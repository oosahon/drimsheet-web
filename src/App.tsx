import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SignupRoute from "@/auth/routes/signup.route";
import { Toaster } from "./shared/ui/sonner";
import CompleteSignupRoute from "./auth/routes/complete-signup.route";
import DashboardRoute from "./routes/reporting/dashbord.route";
import { AnimatedThemeToggler } from "./shared/ui/animated-theme-toggler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/auth/signup" element={<SignupRoute />} />
          <Route
            path="/auth/signup/complete"
            element={<CompleteSignupRoute />}
          />
          <Route path="/" element={<Navigate to="/auth/signup" replace />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />

      <AnimatedThemeToggler />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
