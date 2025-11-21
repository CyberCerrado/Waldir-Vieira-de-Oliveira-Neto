
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import MakerProfilePage from './components/MakerProfilePage';
import NewPrintJobPage from './components/QuotePage';
import AdminDashboard from './components/AdminDashboard';
import GovernmentPortal from './components/GovernmentPortal';
import PrintJobsDashboard from './components/PrintJobsDashboard';
import ChatPage from './components/ChatPage';
import BecomeMakerPage from './components/BecomeMakerPage';
import type { Maker } from './types';
import { UserRole } from './types';
import { initStorage, getUsers } from './services/storageService';

export type Page = 'home' | 'makerProfile' | 'newPrintJob' | 'admin' | 'government' | 'printJobsDashboard' | 'chat' | 'becomeMaker';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageContext, setPageContext] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<Maker | null>(null);
  const [allUsers, setAllUsers] = useState<Maker[]>([]);

  // Initialize DB and load users
  useEffect(() => {
    initStorage();
    setAllUsers(getUsers());
  }, []);

  const handleSetCurrentPage = (page: Page, context?: any) => {
    setCurrentPage(page);
    setPageContext(context);
    window.scrollTo(0, 0);
    // Refresh users list when navigation happens, just in case
    setAllUsers(getUsers());
  };

  // Feature: Dev/Demo Login Handler
  const handleDevLogin = (user: Maker) => {
      setCurrentUser(user);
      // Redirect to dashboard if maker, or home if client
      if (user.roles.includes(UserRole.MAKER)) {
          setCurrentPage('printJobsDashboard');
      } else {
          setCurrentPage('home');
      }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };
  
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={handleSetCurrentPage} currentUser={currentUser} />;
      case 'makerProfile':
        return <MakerProfilePage maker={pageContext as Maker} setCurrentPage={handleSetCurrentPage} />;
      case 'newPrintJob':
        return <NewPrintJobPage setCurrentPage={handleSetCurrentPage} currentUser={currentUser} initialData={pageContext} />;
      case 'printJobsDashboard':
        if (!currentUser || !currentUser.roles.includes(UserRole.MAKER)) {
            setTimeout(() => handleSetCurrentPage('home'), 0);
            return <div className="h-screen flex items-center justify-center">Acesso restrito a Makers. Redirecionando...</div>;
        }
        return <PrintJobsDashboard setCurrentPage={handleSetCurrentPage} />;
      case 'chat':
        if (!currentUser) {
            setTimeout(() => handleSetCurrentPage('home'), 0);
             return <div className="h-screen flex items-center justify-center">Faça login para acessar o chat. Redirecionando...</div>;
        }
        return <ChatPage currentUser={currentUser} />;
      case 'becomeMaker':
        if (currentUser?.roles.includes(UserRole.MAKER)) {
             setTimeout(() => handleSetCurrentPage('printJobsDashboard'), 0);
             return <div className="h-screen flex items-center justify-center">Você já é um Maker! Redirecionando...</div>;
        }
        return <BecomeMakerPage setCurrentPage={handleSetCurrentPage} currentUser={currentUser} onLogin={handleDevLogin} />;
      case 'admin':
        return <AdminDashboard />;
      case 'government':
          return <GovernmentPortal />;
      default:
        return <HomePage setCurrentPage={handleSetCurrentPage} currentUser={currentUser} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header 
        setCurrentPage={handleSetCurrentPage} 
        currentUser={currentUser}
        onLogoutClick={handleLogout}
        onDevLogin={handleDevLogin}
        availableUsers={allUsers} 
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
