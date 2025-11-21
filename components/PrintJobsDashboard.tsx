
import React, { useState, useEffect } from 'react';
import type { Page } from '../App';
import type { PrintJob } from '../types';
import { UserRole } from '../types';
import { CubeIcon, UserIcon, XIcon, LinkIcon, DollarSignIcon, CheckCircleIcon, QrCodeIcon } from './Icons';
import { getPrintJobs, savePrintJob, getUsers } from '../services/storageService';
import PaymentModal from './PaymentModal';

interface PrintJobsDashboardProps {
  setCurrentPage: (page: Page, context?: any) => void;
}

const JobCard: React.FC<{ 
    job: PrintJob; 
    onViewDetails: (job: PrintJob) => void;
    onPay: (job: PrintJob) => void;
    isMaker: boolean;
}> = ({ job, onViewDetails, onPay, isMaker }) => {
    
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

    const isPaid = job.paymentStatus === 'Pago';
    const makerEarnings = job.price - job.serviceFee;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-maker-dark line-clamp-1" title={job.title}>{job.title}</h3>
                    {isPaid ? (
                         <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                             <CheckCircleIcon className="w-3 h-3 mr-1" /> Pago
                         </span>
                    ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                            Pendente
                        </span>
                    )}
                </div>
                
                <div className="flex items-center text-xs text-maker-gray mb-4">
                    <UserIcon className="w-3 h-3 mr-1" />
                    <span>{job.clientName}</span>
                    <span className="mx-2">•</span>
                    <span>{timeAgo(job.createdAt)}</span>
                </div>
                
                {/* Financial Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
                    {isMaker ? (
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Sua Receita:</span>
                            <span className="font-bold text-green-600">R$ {makerEarnings.toFixed(2)}</span>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Total:</span>
                            <span className="font-bold text-maker-dark">R$ {job.price.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                <p className="text-maker-gray text-sm mb-4 line-clamp-2">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 text-xs mb-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                        {job.material}
                    </span>
                     <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100">
                        {job.color}
                    </span>
                </div>
            </div>

            <div className="mt-auto flex gap-2">
                {!isMaker && !isPaid && (
                    <button 
                        onClick={() => onPay(job)}
                        className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm flex items-center justify-center"
                    >
                        <QrCodeIcon className="w-4 h-4 mr-2" /> Pagar
                    </button>
                )}
                {isMaker && !isPaid && (
                     <button className="flex-1 bg-maker-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
                        Enviar Proposta
                    </button>
                )}
                <button 
                    onClick={() => onViewDetails(job)}
                    className="flex-1 bg-white border border-gray-200 text-maker-dark font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Detalhes
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
                    <div className="flex justify-between items-start mb-4">
                        <div>
                             <h3 className="text-xl font-bold text-maker-dark mb-1">{job.title}</h3>
                             <div className="flex items-center text-sm text-maker-gray">
                                <UserIcon className="w-4 h-4 mr-2" />
                                <span>Solicitado por {job.clientName}</span>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-gray-500 uppercase">Valor Total</p>
                             <p className="text-2xl font-bold text-green-600">R$ {job.price.toFixed(2)}</p>
                        </div>
                    </div>

                    <p className="text-maker-dark whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm leading-relaxed">{job.description}</p>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="border border-gray-200 p-4 rounded-lg">
                            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Material</p>
                            <p className="text-maker-dark font-medium">{job.material}</p>
                        </div>
                        <div className="border border-gray-200 p-4 rounded-lg">
                            <p className="text-gray-500 text-xs uppercase font-bold mb-1">Cor</p>
                            <p className="text-maker-dark font-medium">{job.color}</p>
                        </div>
                    </div>

                    {job.fileUrl && (
                        <div className="mt-6">
                             <h4 className="font-bold text-sm text-maker-dark mb-2 flex items-center"><LinkIcon className="w-4 h-4 mr-2"/> Arquivo Original</h4>
                             <a href={job.fileUrl} target="_blank" rel="noopener noreferrer" className="block bg-blue-50 border border-blue-100 rounded-lg p-3 text-blue-700 hover:bg-blue-100 transition-colors text-sm break-all">
                                 {job.fileUrl}
                             </a>
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-gray-200 mt-auto bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-all duration-200">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};


const PrintJobsDashboard: React.FC<PrintJobsDashboardProps> = ({ setCurrentPage }) => {
    const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
    const [paymentJob, setPaymentJob] = useState<PrintJob | null>(null);
    const [jobs, setJobs] = useState<PrintJob[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null); // Simplification

    // Determine if viewer is maker or client (Simplified logic for demo)
    // In a real app, we would use context, but here we infer from LocalStorage "Last Logged In" or pass prop
    // For now, we'll assume if they are on this page, we check the mock users or just treat everyone as seeing everything for the demo
    // To improve: let's get the current user from storage via a dirty hack or just check role from prop if passed.
    // Actually, let's use a simple check:
    const isMakerView = true; // Default to maker dashboard view for this component
    
    useEffect(() => {
        setJobs(getPrintJobs());
    }, []);

    const handleViewDetails = (job: PrintJob) => {
        setSelectedJob(job);
    };

    const handlePay = (job: PrintJob) => {
        setPaymentJob(job);
    };

    const handlePaymentSuccess = () => {
        if (paymentJob) {
            const updatedJobs = jobs.map(j => {
                if (j.id === paymentJob.id) {
                    return { ...j, paymentStatus: 'Pago' as const, status: 'Em andamento' as const };
                }
                return j;
            });
            setJobs(updatedJobs);
            localStorage.setItem('agencia_maker_jobs', JSON.stringify(updatedJobs));
            setPaymentJob(null);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Painel de Controle</h2>
                    <p className="text-gray-500 mt-1">Gerencie pedidos, pagamentos e produção.</p>
                </div>
                 <div className="flex gap-2">
                    <button 
                        onClick={() => setCurrentPage('newPrintJob')}
                        className="bg-maker-primary text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all">
                        + Nova Solicitação
                    </button>
                 </div>
            </div>

            {/* Stats Row for Demo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold">Faturamento (Hoje)</p>
                    <p className="text-xl font-bold text-green-600">R$ 450,00</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold">Pedidos Pendentes</p>
                    <p className="text-xl font-bold text-yellow-500">{jobs.filter(j => j.status === 'Aberto').length}</p>
                </div>
                 <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold">Em Produção</p>
                    <p className="text-xl font-bold text-blue-500">{jobs.filter(j => j.status === 'Em andamento').length}</p>
                </div>
                 <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase font-bold">Comissão Agência</p>
                    <p className="text-xl font-bold text-maker-dark">R$ 67,50</p>
                </div>
            </div>
            
            {jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <JobCard 
                            key={job.id} 
                            job={job} 
                            onViewDetails={handleViewDetails}
                            onPay={handlePay}
                            isMaker={false} // In a real app, switch based on logged user
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                     <CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">Sem pedidos recentes</h3>
                    <p className="text-gray-500 mt-2">Crie uma nova solicitação para testar o fluxo.</p>
                </div>
            )}
            
            {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
            {paymentJob && (
                <PaymentModal 
                    job={paymentJob} 
                    onClose={() => setPaymentJob(null)} 
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default PrintJobsDashboard;
