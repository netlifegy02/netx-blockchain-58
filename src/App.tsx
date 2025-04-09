import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NodesPage from './pages/NodesPage';
import TokensPage from './pages/TokensPage';
import MiningPage from './pages/MiningPage';
import MobileAppPage from './pages/MobileAppPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';
import MaintenancePage from './pages/MaintenancePage';
import { Toaster } from 'sonner';
import InstallationGuidePage from './pages/InstallationGuidePage';

function App() {
  const isMaintenanceMode = false;

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/nodes" element={<NodesPage />} />
        <Route path="/tokens" element={<TokensPage />} />
        <Route path="/mining" element={<MiningPage />} />
        <Route path="/mobile" element={<MobileAppPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/installation" element={<InstallationGuidePage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
