
import React from 'react';
// Fix: Corrected the import path for the Icon component.
import { BuildingIcon } from './Icons';

const ServiceCard: React.FC<{ title: string; description: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = ({ title, description, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center transform hover:-translate-y-1 transition-transform duration-300">
        <Icon className="h-12 w-12 text-maker-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-maker-dark mb-2">{title}</h3>
        <p className="text-maker-gray">{description}</p>
    </div>
);

const GovernmentPortal: React.FC = () => {
    const services = [
        { title: 'Peças Urbanas', description: 'Reposição e criação de componentes para mobiliário urbano, sinalização e infraestrutura.', icon: BuildingIcon },
        { title: 'Equipamentos Educacionais', description: 'Desenvolvimento de materiais didáticos, modelos anatômicos e kits de robótica para escolas.', icon: BuildingIcon },
        { title: 'Prototipagem e Maquetes', description: 'Criação de protótipos funcionais e maquetes arquitetônicas de alta fidelidade para projetos públicos.', icon: BuildingIcon },
        { title: 'Soluções de Acessibilidade', description: 'Produção de objetos e adaptações personalizadas para garantir a inclusão de cidadãos.', icon: BuildingIcon },
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="bg-maker-primary text-white py-20">
                <div className="container mx-auto text-center px-4">
                    <BuildingIcon className="h-16 w-16 mx-auto mb-4" />
                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Portal Governamental Agência Maker</h2>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">Soluções inovadoras de fabricação digital para o setor público de Rio Verde e região.</p>
                </div>
            </section>
            
            {/* Services Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-3xl font-bold text-center text-maker-dark mb-12">Como Podemos Ajudar</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map(service => <ServiceCard key={service.title} {...service} />)}
                    </div>
                </div>
            </section>

            {/* Contact / RFP Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                    <h3 className="text-3xl font-bold text-center text-maker-dark mb-4">Solicite uma Proposta Formal</h3>
                    <p className="text-center text-maker-gray mb-8">Nossa rede de makers está pronta para atender às demandas do seu órgão público com agilidade, eficiência e custos competitivos.</p>
                    <div className="bg-gray-50 p-8 rounded-lg shadow-inner">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="gov-name" className="block text-sm font-medium text-gray-700">Nome do Contato</label>
                                    <input type="text" id="gov-name" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="gov-entity" className="block text-sm font-medium text-gray-700">Órgão / Instituição</label>
                                    <input type="text" id="gov-entity" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="gov-email" className="block text-sm font-medium text-gray-700">Email para Contato</label>
                                {/* Fix: Corrected typo in className from border-ray-300 to border-gray-300 */}
                                <input type="email" id="gov-email" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <label htmlFor="gov-description" className="block text-sm font-medium text-gray-700">Descrição da Necessidade</label>
                                <textarea id="gov-description" rows={5} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="bg-maker-secondary text-maker-dark font-bold py-3 px-8 rounded-lg text-lg transform hover:scale-105 transition-transform duration-300">
                                    Enviar Solicitação
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GovernmentPortal;