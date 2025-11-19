import React, { useState } from 'react';
import type { Page } from '../App';
import type { PrintJob } from '../types';
import { MOCK_PRINT_JOBS } from '../constants';
import { CubeIcon, UserIcon, XIcon, LinkIcon } from './Icons';

interface PrintJobsDashboardProps {
  setCurrentPage: (page: Page, context?: any) => void;
}

const JobCard: React.FC<{ job: PrintJob; onViewDetails: (job: PrintJob) => void }> = ({ job, onViewDetails }) => {
    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " anos atrás";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " meses atrás";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " dias atrás";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " horas atrás";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutos atrás";
        return Math.floor(seconds) + " segundos atrás";
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between transition-transform duration-300 hover:scale-105">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-maker-dark">{job.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{job.status}</span>
                </div>
                <div className="flex items-center text-sm text-maker-gray mt-1 mb-4">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span>Solicitado por {job.clientName}</span>
                    <span className="mx-2">•</span>
                    <span>{timeAgo(job.createdAt)}</span>
                </div>
                <p className="text-maker-gray text-sm mb-4 line-clamp-3">{job.description}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                        Material: <span className="font-semibold">{job.material}</span>
                    </span>
                     <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                        Cor: <span className="font-semibold">{job.color}</span>
                    </span>
                </div>
            </div>
            <div className="mt-6 flex gap-2">
                <button className="w-full bg-maker-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200">
                    Fazer Orçamento
                </button>
                 <button 
                    onClick={() => onViewDetails(job)}
                    className="w-full bg-gray-200 text-maker-dark font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-200">
                    Ver Detalhes
                </button>
            </div>
        </div>
    );
};

const JobDetailModal: React.FC<{ job: PrintJob; onClose: () => void }> = ({ job, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-maker-dark">Detalhes da Solicitação</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <h3 className="text-xl font-bold text-maker-dark mb-2">{job.title}</h3>
                    <div className="flex items-center text-sm text-maker-gray mb-4">
                        <UserIcon className="w-4 h-4 mr-2" />
                        <span>Solicitado por {job.clientName}</span>
                    </div>
                    <p className="text-maker-dark whitespace-pre-wrap">{job.description}</p>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-maker-gray font-semibold">Material</p>
                            <p className="text-maker-dark text-lg font-bold">{job.material}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-maker-gray font-semibold">Cor</p>
                            <p className="text-maker-dark text-lg font-bold">{job.color}</p>
                        </div>
                    </div>

                    {job.fileUrl && (
                        <div className="mt-6">
                             <h4 className="font-semibold text-maker-dark mb-2">Modelo de Referência</h4>
                             <a href={job.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-maker-primary hover:underline break-all">
                                 <LinkIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                                 <span>{job.fileUrl}</span>
                             </a>
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-gray-200 mt-auto bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button onClick={onClose} className="bg-gray-200 text-maker-dark font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-all duration-200">
                        Fechar
                    </button>
                    <button className="bg-maker-secondary text-maker-dark font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-all duration-200">
                        Fazer Orçamento
                    </button>
                </div>
            </div>
        </div>
    );
};


const PrintJobsDashboard: React.FC<PrintJobsDashboardProps> = ({ setCurrentPage }) => {
    const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);

    const handleViewDetails = (job: PrintJob) => {
        setSelectedJob(job);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-maker-dark">Painel de Impressões</h2>
                    <p className="text-maker-gray mt-1">Veja as solicitações de impressão disponíveis e faça sua proposta.</p>
                </div>
                 <button 
                    onClick={() => setCurrentPage('newPrintJob')}
                    className="bg-maker-secondary text-maker-dark font-bold py-2 px-6 rounded-lg text-md transform hover:scale-105 transition-transform duration-300 hidden sm:block">
                    + Solicitar Impressão
                </button>
            </div>
            
            {MOCK_PRINT_JOBS.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_PRINT_JOBS.map(job => (
                        <JobCard key={job.id} job={job} onViewDetails={handleViewDetails} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                     <CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-maker-dark">Nenhuma solicitação no momento</h3>
                    <p className="text-maker-gray mt-2">Volte mais tarde para ver novas oportunidades de impressão.</p>
                </div>
            )}
            
            {selectedJob && <JobDetailModal job={selectedJob} onClose={handleCloseModal} />}
        </div>
    );
};

export default PrintJobsDashboard;