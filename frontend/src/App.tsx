import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ActivityPage } from './pages/ActivityPage';
import { SecurityPage } from './pages/SecurityPage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { PipelinePage } from './pages/PipelinePage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { VulnerabilityReportPage } from './pages/VulnerabilityReportPage';
import { TestingPage } from './pages/TestingPage';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    // Protected routes: redirect to /login if not authenticated
    const protectedPaths = ['/dashboard', '/profile', '/activity', '/security', '/analyzer', '/admin', '/admin/users'];
    if (!isLoading && !user && protectedPaths.includes(currentPath)) {
      return <LoginPage onNavigate={navigate} initialRole={currentPath.startsWith('/admin') ? 'admin' : 'user'} />;
    }

    switch (currentPath) {
      case '/':
        return <LandingPage onNavigate={navigate} />;
      case '/login':
        return <LoginPage onNavigate={navigate} initialRole="user" />;
      case '/admin-login':
        return <LoginPage onNavigate={navigate} initialRole="admin" />;
      case '/register':
        return <RegisterPage onNavigate={navigate} />;
      case '/dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case '/profile':
        return <ProfilePage />;
      case '/activity':
        return <ActivityPage />;
      case '/security':
        return <SecurityPage onNavigate={navigate} />;
      case '/analyzer':
        return <AnalyzerPage />;
      case '/admin':
        return <AdminDashboardPage onNavigate={navigate} />;
      case '/admin/users':
        return <AdminUsersPage onNavigate={navigate} />;
      case '/pipeline':
        return <PipelinePage />;
      case '/architecture':
        return <ArchitecturePage />;
      case '/vulnerability-report':
        return <VulnerabilityReportPage />;
      case '/testing':
        return <TestingPage />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07111f] flex flex-col items-center justify-center text-cyan-300">
        <div className="size-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
        <span className="font-mono text-xs tracking-widest uppercase">Initializing SecureID Session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07111f] text-slate-100">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <div className="flex-1">{renderPage()}</div>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
