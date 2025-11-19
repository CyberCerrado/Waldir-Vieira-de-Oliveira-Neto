
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
import { MOCK_MAKERS } from './constants';
import { jwtDecode } from 'jwt-decode';

export type Page = 'home' | 'makerProfile' | 'newPrintJob' | 'admin' | 'government' | 'printJobsDashboard' | 'chat' | 'becomeMaker';

// Add google to the window interface
declare global {
  interface Window {
    google: any;
  }
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageContext, setPageContext] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<Maker | null>(null);

  const handleSetCurrentPage = (page: Page, context?: any) => {
    setCurrentPage(page);
    setPageContext(context);
    window.scrollTo(0, 0);
  };

  const handleGoogleCredentialResponse = (response: any) => {
    try {
      const decoded: { name: string; email: string; picture: string; sub: string } = jwtDecode(response.credential);
      
      const existingMaker = MOCK_MAKERS.find(m => m.email === decoded.email);

      if (existingMaker) {
        setCurrentUser({ ...existingMaker, avatarUrl: decoded.picture });
      } else {
        const newUser: Maker = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          avatarUrl: decoded.picture,
          roles: [UserRole.CLIENT],
          rating: 0,
          reviews: 0,
          location: 'Desconhecido',
          specialties: [],
        };
        setCurrentUser(newUser);
      }
    } catch (error) {
      console.error("Error decoding JWT or setting user:", error);
    }
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
    if (window.google) {
      // Only disable if google is actually initialized
      try {
          window.google.accounts.id.disableAutoSelect();
      } catch(e) {
          // Ignore google errors
      }
    }
    setCurrentUser(null);
    setCurrentPage('home');
  };
  
  useEffect(() => {
    // Only attempt Google Auth initialization if we have a window object
    // and we are not already logged in
    if (window.google?.accounts?.id) {
      try {
          window.google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: handleGoogleCredentialResponse,
          });

          const signInButton = document.getElementById('google-signin-button');

          // Only render if the button exists AND we aren't logged in
          if (!currentUser && signInButton) {
            window.google.accounts.id.renderButton(
              signInButton,
              { theme: 'outline', size: 'large', text: 'signin_with', shape: 'pill', logo_alignment: 'left' }
            );
          } else if (currentUser && signInButton) {
            signInButton.innerHTML = '';
          }
      } catch (error) {
          console.warn("Google Auth initialization skipped (Dev Mode active or config missing)");
      }
    }
  }, [currentUser, currentPage]); // Re-run if page changes to ensure button re-renders in header


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
            // Instead of forcing home immediately, we can show a restricted access message or just redirect
            // For UX, let's redirect but maybe we could show a toast in future
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
        if (!currentUser) {
             setTimeout(() => handleSetCurrentPage('home'), 0);
             return <div className="h-screen flex items-center justify-center">Faça login para se inscrever. Redirecionando...</div>;
        }
        return <BecomeMakerPage setCurrentPage={handleSetCurrentPage} currentUser={currentUser} />;
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
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
