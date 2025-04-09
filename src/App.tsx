
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

import IndexPage from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFound from '@/pages/NotFound';
import TokensPage from '@/pages/TokensPage';
import MiningPage from '@/pages/MiningPage';
import SettingsPage from '@/pages/SettingsPage';
import AdminPage from '@/pages/AdminPage';
import MobileAppPage from '@/pages/MobileAppPage';
import MaintenancePage from '@/pages/MaintenancePage';
import NodesPage from '@/pages/NodesPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/mining" element={<MiningPage />} />
          <Route path="/mobile-app" element={<MobileAppPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/nodes" element={<NodesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="bottom-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
