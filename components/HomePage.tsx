
import React, { useState } from 'react';
import type { Maker, ExternalModel } from '../types';
import { UserRole } from '../types';
import { MOCK_MAKERS, EXTERNAL_3D_SITES } from '../constants';
import { StarIcon, MapPinIcon, ShieldCheckIcon, ZapIcon, LayersIcon, CpuIcon, TruckIcon, UploadCloudIcon, SearchIcon, LinkIcon, CubeIcon } from './Icons';
import type { Page } from '../App';
import { searchExternalModels } from '../services/searchService';

interface HomePageProps {
  setCurrentPage: (page: Page, context?: any) => void;
  currentUser: Maker | null;
}

const MakerCard: React.FC<{ maker: Maker, onViewProfile: (maker: Maker) => void }> = ({ maker, onViewProfile }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
            <img src={maker.avatarUrl} alt={maker.name} className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-gray-100" />
            {maker.isCertified && (
                <div className="absolute bottom-3 -right-1 bg-white rounded-full p-1" title="Maker Certificado">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-500" />
                </div>
            )}
        </div>
        <h3 className="text-lg font-bold text-maker-dark">{maker.name}</h3>
        <p className="text-maker-primary text-xs font-medium uppercase tracking-wide mb-2">{maker.roles[0]}</p>
        
        <div className="flex items-center justify-center mb-3 space-x-1">
            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-bold text-gray-700">{maker.rating}</span>
            <span className="text-xs text-gray-400">({maker.reviews})</span>
        </div>

        <div className="flex items-center text-gray-500 text-xs mb-4">
            <MapPinIcon className="w-3 h-3 mr-1"/>
            <span>{maker.location}</span>
        </div>
        
        <button onClick={() => onViewProfile(maker)} className="mt-auto w-full bg-gray-50 text-maker-dark font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm">
            Ver Perfil
        </button>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ExternalModel[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleViewProfile = (maker: Maker) => {
    setCurrentPage('makerProfile', maker);
  };
  
  const isAlreadyMaker = currentUser?.roles.some(role => role !== UserRole.CLIENT);

  const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!searchTerm.trim()) return;

      setIsSearching(true);
      setHasSearched(true);
      
      // Call the AI simulation service
      const results = await searchExternalModels(searchTerm);
      setSearchResults(results);
      setIsSearching(false);
  };

  const handleQuoteModel = (model: ExternalModel) => {
      // Pass the model data to the Quote Page
      setCurrentPage('newPrintJob', {
          title: model.title,
          description: `Orçamento para impressão do modelo encontrado: ${model.title} (por ${model.author}).`,
          modelUrl: model.link,
          externalImage: model.imageUrl // Custom prop to show image in quote page
      });
  };

  const getSourceColor = (source: string) => {
      switch(source) {
          case 'Thingiverse': return 'bg-blue-500';
          case 'Cults3D': return 'bg-purple-600';
          case 'Printables': return 'bg-orange-500';
          default: return 'bg-gray-600';
      }
  };

  return (
    <div className="animate-fade-in font-sans">
      {/* Modern Hero Section / Search Hub */}
      <section className={`relative bg-slate-900 text-white overflow-hidden transition-all duration-500 ${hasSearched ? 'min-h-[400px]' : 'min-h-[600px]'} flex items-center`}>
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
                
                {!hasSearched && (
                    <>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
                            <ZapIcon className="w-4 h-4 mr-2 text-yellow-400" />
                            O "Google" da Impressão 3D
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-400">
                            Encontre. Orce. Imprima.
                        </h1>
                        
                        <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                            Busque modelos 3D em todos os grandes sites simultaneamente e conecte-se com makers para imprimir.
                        </p>
                    </>
                )}

                {hasSearched && (
                     <h2 className="text-3xl font-bold mb-6">Resultados para "{searchTerm}"</h2>
                )}

                {/* Search Bar Interface */}
                <div className="w-full max-w-3xl relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <form onSubmit={handleSearch} className="relative bg-white rounded-xl shadow-2xl p-2 flex flex-col md:flex-row items-center">
                        <div className="flex-grow w-full flex items-center px-4">
                            <SearchIcon className="w-6 h-6 text-gray-400 mr-3" />
                            <input 
                                type="text" 
                                placeholder="O que você quer imprimir hoje? (Ex: Pikachu, Suporte, Vaso)" 
                                className="w-full py-4 text-lg text-slate-800 placeholder-gray-400 bg-transparent outline-none border-none focus:ring-0"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isSearching}
                            className="w-full md:w-auto bg-maker-primary hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg whitespace-nowrap mt-2 md:mt-0 flex items-center justify-center"
                        >
                            {isSearching ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : 'Buscar'}
                        </button>
                    </form>
                </div>
                
                {!hasSearched && (
                    <div className="mt-8 flex items-center space-x-6 text-sm text-slate-400">
                        <span>Sites integrados:</span>
                        {EXTERNAL_3D_SITES.map(site => (
                            <span key={site.name} className="flex items-center font-medium text-slate-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></div>
                                {site.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* Search Results Section */}
      {hasSearched && (
          <section className="py-12 bg-gray-50 min-h-[500px]">
              <div className="container mx-auto px-4">
                  {isSearching ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-4">
                          <div className="w-16 h-16 border-4 border-maker-primary border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-lg text-gray-600 font-medium">Varrendo a internet em busca de modelos...</p>
                      </div>
                  ) : searchResults.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {searchResults.map((model) => (
                              <div key={model.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                                  <div className="relative h-48 overflow-hidden bg-gray-200">
                                      <img 
                                        src={model.imageUrl} 
                                        alt={model.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            // Fallback if image fails
                                            (e.target as HTMLImageElement).src = `https://placehold.co/600x400?text=${encodeURIComponent(model.title)}`;
                                        }}
                                      />
                                      <span className={`absolute top-3 right-3 ${getSourceColor(model.source)} text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm`}>
                                          {model.source}
                                      </span>
                                      {model.isFree && (
                                          <span className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                                              Grátis
                                          </span>
                                      )}
                                  </div>
                                  <div className="p-5">
                                      <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1 line-clamp-1">{model.title}</h3>
                                      <p className="text-sm text-gray-500 mb-4">por <span className="font-medium">{model.author}</span></p>
                                      
                                      <div className="flex gap-3">
                                          <a 
                                            href={model.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                          >
                                              <LinkIcon className="w-4 h-4 mr-2" /> Ver Original
                                          </a>
                                          <button 
                                            onClick={() => handleQuoteModel(model)}
                                            className="flex-1 flex items-center justify-center py-2 px-4 bg-maker-secondary hover:bg-yellow-400 text-maker-dark rounded-lg text-sm font-bold shadow-sm transition-colors"
                                          >
                                              <ZapIcon className="w-4 h-4 mr-2" /> Orçar Agora
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="text-center py-20">
                          <CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-gray-800">Nenhum modelo encontrado</h3>
                          <p className="text-gray-500">Tente buscar por termos mais genéricos em inglês (ex: "Phone Stand").</p>
                      </div>
                  )}
                  
                  {searchResults.length > 0 && (
                      <div className="mt-12 text-center">
                         <p className="text-gray-500 text-sm mb-4">Não encontrou o que queria?</p>
                         <button 
                            onClick={() => setCurrentPage('newPrintJob')}
                            className="text-maker-primary font-semibold hover:underline"
                         >
                             Fazer pedido personalizado sem modelo &rarr;
                         </button>
                      </div>
                  )}
              </div>
          </section>
      )}

      {/* How It Works Steps - Simplified (Only show if not searching results) */}
      {!hasSearched && (
        <>
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Como funciona a Agência Maker?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="w-16 h-16 bg-blue-100 text-maker-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/5">
                                <SearchIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Busque Integrado</h3>
                            <p className="text-gray-600">Digite o que precisa. Nossa tecnologia busca em todos os sites de STL ao mesmo tempo.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 relative">
                            <div className="hidden md:block absolute top-1/2 -left-4 transform -translate-y-1/2 text-gray-200">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                            </div>
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-900/5">
                                <UploadCloudIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Orçamento Instantâneo</h3>
                            <p className="text-gray-600">Escolha o modelo, clique em "Orçar" e nossa IA calcula o preço na hora.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 relative">
                            <div className="hidden md:block absolute top-1/2 -left-4 transform -translate-y-1/2 text-gray-200">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                            </div>
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/5">
                                <TruckIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Receba em Casa</h3>
                            <p className="text-gray-600">Um maker verificado produz sua peça e envia para você com segurança.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-slate-50 border-y border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                    <div className="max-w-2xl">
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Makers em Destaque</h3>
                        <p className="text-gray-500">Profissionais verificados prontos para imprimir seu projeto agora mesmo.</p>
                    </div>
                    {!isAlreadyMaker && (
                        <button 
                            onClick={() => setCurrentPage('becomeMaker')}
                            className="mt-4 md:mt-0 text-maker-primary font-semibold hover:underline flex items-center">
                            Quero vender minhas impressões &rarr;
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_MAKERS.filter(m => m.roles.includes(UserRole.MAKER)).slice(0,4).map(maker => (
                    <MakerCard key={maker.id} maker={maker} onViewProfile={handleViewProfile} />
                    ))}
                </div>
                </div>
            </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
