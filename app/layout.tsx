
import React, { useState, useEffect } from 'react';
import { User, Notification, Location, UserRole } from '../types';
import { MOCK_USERS, MOCK_LOCATIONS } from '../constants';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthPortal } from '../components/AuthPortal';
import DashboardPage from './page';
import ServicesPage from './services/page';
import ProfilePage from './profile/page';
import StaffPage from './staff/page';
import CustomersPage from './customers/page';

/**
 * RootLayout mimics the Next.js App Router 'layout.tsx'
 * It wraps the entire application and manages persistent state.
 */
export default function RootLayout() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('databook_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [activePath, setActivePath] = useState('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('ALL');

  useEffect(() => {
    const handleGlobalSearch = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalSearch);
    return () => window.removeEventListener('keydown', handleGlobalSearch);
  }, []);

  const login = (role: UserRole) => {
    const userTemplate = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    const user: User = { 
      ...userTemplate, 
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString() 
    };
    setCurrentUser(user);
    localStorage.setItem('databook_auth', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('databook_auth');
  };

  if (!currentUser) {
    return <AuthPortal onLogin={login} />;
  }

  // Next.js-style Page Switching
  const renderPage = () => {
    switch(activePath) {
      case 'dashboard': return <DashboardPage user={currentUser} locationId={selectedLocationId} />;
      case 'services': return <ServicesPage user={currentUser} locationId={selectedLocationId} />;
      case 'staff': return <StaffPage user={currentUser} />;
      case 'customers': return <CustomersPage user={currentUser} />;
      case 'profile': return <ProfilePage user={currentUser} onLogout={logout} />;
      default: return <DashboardPage user={currentUser} locationId={selectedLocationId} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden">
      <Sidebar 
        userRole={currentUser.role} 
        activePath={activePath} 
        onNavigate={setActivePath} 
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          user={currentUser}
          locations={MOCK_LOCATIONS}
          selectedLocationId={selectedLocationId}
          onLocationChange={setSelectedLocationId}
          notifications={notifications}
        />
        
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
}
