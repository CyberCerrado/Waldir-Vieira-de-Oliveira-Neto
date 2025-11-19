
import React, { useState } from 'react';
import type { Maker } from '../types';
import { CubeIcon } from './Icons';
import type { Page } from '../App';

interface MakerProfilePageProps {
  maker: Maker;
  setCurrentPage: (page: Page) => void;
}

const MakerProfilePage: React.FC<MakerProfilePageProps> = ({ maker, setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'shop' | 'services'>('portfolio');

  const renderPortfolio = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {maker.portfolio?.map(item => (
        <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
          <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover"/>
          <div className="p-4">
            <h4 className="font-semibold text-maker-dark">{item.title}</h4>
          </div>
        </div>
      ))}
    </div>
  );
  
  // A minimal component body is rendered to fix the truncated file.
  // The full profile page implementation is beyond the scope of the syntax fix.
  return (
      <div className="container mx-auto p-8">
          <button onClick={() => setCurrentPage('home')} className="text-maker-primary hover:underline mb-6">&larr; Voltar para Home</button>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center space-x-6">
                <img src={maker.avatarUrl} alt={maker.name} className="w-24 h-24 rounded-full object-cover" />
                <div>
                    <h1 className="text-3xl font-bold text-maker-dark">{maker.name}</h1>
                    <p className="text-maker-primary font-semibold">{maker.roles.join(' / ')}</p>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-bold text-maker-dark mb-4">Portfólio</h2>
                {renderPortfolio()}
            </div>
          </div>
      </div>
  );
};

export default MakerProfilePage;
