
import React, { useState } from 'react';
import { CubeIcon, UserIcon, ZapIcon } from './Icons';
import type { Page } from '../App';
import type { Maker } from '../types';
import { UserRole } from '../types';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
  currentUser: Maker | null;
  onLogoutClick: () => void;
  onDevLogin: (user: Maker) => void;
  availableUsers?: Maker[];
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage, currentUser, onLogoutClick, onDevLogin, availableUsers = [] }) => {
  const isMaker = currentUser?.roles.includes(UserRole.MAKER);
  const [showDevLogin, setShowDevLogin] = useState(false);

  const navLinks: { label: string; page: Page; requiresAuth?: boolean; makerOnly?: boolean }[] = [
    { label: 'Solicitar Impressão', page: 'newPrintJob' },
    { label: 'Painel de Impressões', page: 'printJobsDashboard', requiresAuth: true, makerOnly: true },
    { label: 'Chat', page: 'chat', requiresAuth: true },
  ];

  const handleDevUserSelect = (user: Maker) => {
      onDevLogin(user);
      setShowDevLogin(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
            <CubeIcon className="h-8 w-8 text-maker-primary" />
            <h1 className="ml-2 text-2xl font-bold text-maker-dark">Agência Maker</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              if (link.requiresAuth && !currentUser) return null;
              if (link.makerOnly && !isMaker) return null;
              return (
              <button
                key={link.page}
                onClick={() => setCurrentPage(link.page)}
                className="text-maker-gray font-medium hover:text-maker-primary transition-colors duration-200"
              >
                {link.label}
              </button>
              );
            })}
          </nav>
          <div className="flex items-center">
            {currentUser ? (
               <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-9 w-9 rounded-full border border-gray-200" />
                    <span className="font-medium text-maker-dark hidden sm:inline">
                        {currentUser.name.split(' ')[0]}
                    </span>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block ring-1 ring-black ring-opacity-5 animate-fade-in">
                     <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                         Logado como {currentUser.roles[0]}
                     </div>
                     <button onClick={onLogoutClick} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                         Sair
                     </button>
                 </div>
              </div>
            ) : (
                <div className="flex items-center gap-2">
                    {/* Dev/Demo Login Dropdown - Only login option for MVP */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowDevLogin(!showDevLogin)}
                            className="bg-maker-secondary text-maker-dark font-bold py-2 px-4 rounded-full text-sm hover:bg-yellow-400 transition-colors flex items-center shadow-sm"
                        >
                            <ZapIcon className="w-4 h-4 mr-2" />
                            Entrar / Cadastrar
                        </button>

                        {showDevLogin && (
                            <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-2 animate-fade-in max-h-[80vh] overflow-y-auto">
                                <p className="text-xs font-bold text-gray-400 uppercase px-3 py-2">Login Rápido (Demo Ypetec):</p>
                                {availableUsers.map(maker => (
                                    <button
                                        key={maker.id}
                                        onClick={() => handleDevUserSelect(maker)}
                                        className="w-full text-left flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                    >
                                        <img src={maker.avatarUrl} className="w-8 h-8 rounded-full mr-3 border border-gray-200" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-maker-primary">{maker.name}</p>
                                            <p className="text-xs text-gray-500">{maker.roles[0]}</p>
                                        </div>
                                    </button>
                                ))}
                                <div className="border-t border-gray-100 mt-2 pt-2">
                                    <button
                                        onClick={() => { setShowDevLogin(false); setCurrentPage('becomeMaker'); }}
                                        className="w-full text-left flex items-center p-2 hover:bg-yellow-50 rounded-lg transition-colors text-maker-primary font-semibold text-sm"
                                    >
                                        <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-lg font-bold">+</span>
                                        Criar Novo Cadastro
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
             <button className="md:hidden ml-4 text-maker-dark">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay to close dropdown when clicking outside */}
      {showDevLogin && (
          <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowDevLogin(false)}></div>
      )}
    </header>
  );
};

export default Header;
