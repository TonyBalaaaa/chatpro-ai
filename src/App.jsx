import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from '@/pages/ChatPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';
import ManageAgentsPage from '@/pages/ManageAgentsPage';
import ExplorePage from '@/pages/ExplorePage'; // Nova página
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AgentsProvider } from '@/contexts/AgentsContext';
import { PlanProvider, usePlan } from '@/contexts/PlanContext';

const AppContent = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: planLoading } = usePlan();
  const [theme, setTheme] = useState(() => localStorage.getItem('chatpro_theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('chatpro_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  
  if (authLoading || planLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg font-medium">Carregando ChatPro Interplase AI...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<ChatPage theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/dashboard" element={<DashboardPage theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/manage-agents" element={<ManageAgentsPage theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/explore" element={<ExplorePage theme={theme} toggleTheme={toggleTheme} />} /> {/* Nova Rota */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Route>
        
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
      <Toaster />
    </TooltipProvider>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlanProvider>
          <AgentsProvider>
            <AppContent />
          </AgentsProvider>
        </PlanProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;