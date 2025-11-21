
import React, { useState } from 'react';
import type { Page } from '../App';
import type { Maker } from '../types';
import { UserRole } from '../types';
import { LinkIcon } from './Icons';
import { USER_ROLES_OPTIONS } from '../constants';
import { saveUser } from '../services/storageService';

interface BecomeMakerPageProps {
  setCurrentPage: (page: Page) => void;
  currentUser: Maker | null;
  onLogin: (user: Maker) => void;
}

const BecomeMakerPage: React.FC<BecomeMakerPageProps> = ({ setCurrentPage, currentUser, onLogin }) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    bio: '',
    specialties: [] as string[],
    equipment: '',
    portfolioUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecialtyChange = (specialty: string) => {
    setFormData(prev => {
      const newSpecialties = prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty];
      return { ...prev, specialties: newSpecialties };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Construct the new User Object
    const newUser: Maker = {
        id: `maker-${Date.now()}`, // Generate a timestamp-based ID
        name: formData.name,
        email: formData.email,
        roles: [UserRole.MAKER, ...formData.specialties.map(s => s as UserRole).filter(s => s !== UserRole.MAKER)], // Add selected roles
        avatarUrl: currentUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`, // Use existing avatar or generate new
        rating: 5.0, // Start with 5 stars (New)
        reviews: 0,
        location: 'Rio Verde, GO', // Default for MVP
        specialties: formData.specialties,
        services: [formData.equipment],
        bio: formData.bio,
        isCertified: false
    };

    // Save to "Database"
    saveUser(newUser);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Cadastro realizado com sucesso! Você está sendo redirecionado para o seu painel.');
      
      // Auto-login the user
      onLogin(newUser);
    }, 1500);
  };
  
  const isSubmitDisabled = !formData.name || !formData.email || !formData.phone || !formData.bio || formData.specialties.length === 0 || isLoading;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-maker-dark">Torne-se um Maker na Agência</h2>
          <p className="mt-2 text-lg text-maker-gray">
            Junte-se à nossa rede de talentos, receba projetos e monetize suas habilidades de fabricação digital.
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-bold text-maker-dark border-b pb-2">Suas Informações</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
            </div>
             <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(XX) XXXXX-XXXX" required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>

            <h3 className="text-xl font-bold text-maker-dark border-b pb-2 pt-4">Suas Habilidades</h3>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Conte-nos sobre você
              </label>
              <textarea id="bio" name="bio" rows={4} value={formData.bio} onChange={handleInputChange} placeholder="Uma breve biografia sobre sua experiência, paixão pelo que faz, etc." required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>

             <div>
                <label className="block text-sm font-medium text-gray-700">Especialidades</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {USER_ROLES_OPTIONS.map(role => (
                        <div key={role} className="flex items-center">
                            <input
                                id={role}
                                name="specialties"
                                type="checkbox"
                                value={role}
                                checked={formData.specialties.includes(role)}
                                onChange={() => handleSpecialtyChange(role)}
                                className="h-4 w-4 text-maker-primary border-gray-300 rounded focus:ring-maker-primary"
                            />
                            <label htmlFor={role} className="ml-2 block text-sm text-gray-900">{role}</label>
                        </div>
                    ))}
                </div>
            </div>

             <div>
                <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">Seus Equipamentos e Softwares</label>
                <textarea id="equipment" name="equipment" rows={3} value={formData.equipment} onChange={handleInputChange} placeholder="Ex: Impressora Creality Ender 3, Resina Anycubic, SolidWorks, Blender..." className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>

             <div>
              <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700">Link para Portfólio (Opcional)</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                 <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                   <LinkIcon className="w-5 h-5"/>
                 </span>
                 <input type="url" id="portfolioUrl" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleInputChange} placeholder="https://www.instagram.com/seuperfil" className="flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"/>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-maker-secondary hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                  'Enviar Aplicação'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeMakerPage;
