
import React, { useState, useEffect } from 'react';
import { UploadCloudIcon, ZapIcon, CheckCircleIcon, CpuIcon, LinkIcon } from './Icons';
import type { Page } from '../App';
import type { PrintJob, IntelligentQuote } from '../types';
import { getIntelligentPrice } from '../services/geminiService';

interface NewPrintJobPageProps {
  setCurrentPage: (page: Page, context?: any) => void;
  currentUser: any;
  initialData?: { title?: string, description?: string, modelUrl?: string, externalImage?: string };
}

const NewPrintJobPage: React.FC<NewPrintJobPageProps> = ({ setCurrentPage, currentUser, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [modelUrl, setModelUrl] = useState(initialData?.modelUrl || '');
  const [material, setMaterial] = useState('PLA');
  const [color, setColor] = useState('Preto');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiQuote, setAiQuote] = useState<IntelligentQuote | null>(null);

  // Auto-trigger analysis if data is pre-filled
  useEffect(() => {
      if (initialData?.title) {
          // Small delay to let UI settle
          const timer = setTimeout(() => handleAiAnalysis(), 500);
          return () => clearTimeout(timer);
      }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          setFiles(Array.from(e.dataTransfer.files));
          e.dataTransfer.clearData();
      }
  };

  const handleAiAnalysis = async () => {
      if (!description && !files.length && !modelUrl) {
        // If manually triggering and empty, alert
        if(!initialData) alert("Por favor, preencha a descrição ou adicione um arquivo/URL para análise.");
        return;
      }
      setIsAnalyzing(true);
      const quote = await getIntelligentPrice({
          type: 'print',
          description: description || `Impressão de arquivo: ${files[0]?.name || modelUrl}`,
          material,
          modelUrl
      });
      setAiQuote(quote);
      setIsAnalyzing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newJob: PrintJob = {
      id: `job-${Date.now()}`,
      clientId: currentUser?.id || 'guest',
      clientName: currentUser?.name || 'Visitante',
      title,
      description: `${description}\n\n[Análise IA]: ${aiQuote?.analysis || 'N/A'}`,
      material,
      color,
      fileUrl: modelUrl,
      status: 'Aberto',
      createdAt: new Date().toISOString(),
    };

    console.log("Nova solicitação de impressão criada:", newJob);
    
    setTimeout(() => {
        setIsSubmitting(false);
        alert('Sua solicitação foi enviada para nossa rede de makers! Você receberá propostas em breve.');
        setCurrentPage('home');
    }, 1500);
  };
  
  const isSubmitDisabled = !title.trim() || isSubmitting;

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
             <div>
                <h2 className="text-3xl font-extrabold text-slate-900">Estúdio de Cotação</h2>
                <p className="text-gray-500">Configure seu pedido e receba uma estimativa instantânea.</p>
             </div>
             <button onClick={() => setCurrentPage('home')} className="text-sm font-semibold text-maker-primary hover:underline">
                 Cancelar
             </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Form */}
          <div className="flex-grow bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Pre-selected Item Card */}
                {initialData?.externalImage && (
                    <div className="flex items-center p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                        <img src={initialData.externalImage} alt="Preview" className="w-20 h-20 object-cover rounded-lg mr-4" />
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase">Item Selecionado</span>
                            <h3 className="font-bold text-gray-800">{title}</h3>
                            <a href={modelUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-blue-600 flex items-center">
                                <LinkIcon className="w-3 h-3 mr-1"/> Link Original
                            </a>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">O que você quer imprimir?</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Peça de reposição, Miniatura RPG..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maker-primary focus:border-transparent transition-all"
                        required
                    />
                </div>

                {/* File Upload Area */}
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragging ? 'border-maker-primary bg-blue-50' : 'border-gray-300 hover:border-maker-primary hover:bg-gray-50'}`}
                >
                    <div className="space-y-2">
                        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <label htmlFor="file-upload" className="block text-maker-primary font-semibold cursor-pointer">
                            Clique para carregar ou arraste seu arquivo 3D
                        </label>
                        <p className="text-xs text-gray-500">Suporta STL, OBJ, STEP (Máx 50MB)</p>
                        <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} accept=".stl,.obj,.step" />
                    </div>
                    {files.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {files.map(f => (
                                <span key={f.name} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                                    {f.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Material</label>
                        <select
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                        >
                            <option>PLA (Padrão)</option>
                            <option>ABS (Resistente)</option>
                            <option>PETG (Durável)</option>
                            <option>Resina (Detalhado)</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Cor</label>
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="Ex: Preto, Branco..."
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Detalhes Adicionais</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva requisitos de resistência, preenchimento (infill) ou acabamento..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maker-primary focus:border-transparent"
                  />
                </div>

                <div className="pt-4 border-t">
                    <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="w-full bg-maker-primary text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Orçamentos aos Makers'}
                    </button>
                </div>
              </form>
          </div>

          {/* Right Column: AI Analysis */}
          <div className="lg:w-1/3 space-y-6">
              {/* AI Card */}
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                       <CpuIcon className="w-32 h-32" />
                   </div>
                   <div className="relative z-10">
                       <div className="flex items-center space-x-2 mb-4 text-emerald-400">
                           <ZapIcon className="w-5 h-5" />
                           <span className="font-bold tracking-wider text-sm uppercase">Estimativa Inteligente</span>
                       </div>
                       
                       {!aiQuote ? (
                           <div className="text-center py-8">
                               <p className="text-gray-300 mb-6">Analise seu projeto com IA para obter uma estimativa de preço e recomendações técnicas antes de enviar.</p>
                               <button 
                                    onClick={handleAiAnalysis}
                                    disabled={isAnalyzing}
                                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center group"
                               >
                                   {isAnalyzing ? (
                                       <span className="flex items-center"><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div> Analisando...</span>
                                   ) : (
                                       <span className="flex items-center">Gerar Estimativa <CpuIcon className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform"/></span>
                                   )}
                               </button>
                           </div>
                       ) : (
                           <div className="animate-fade-in">
                               <div className="bg-white/10 rounded-lg p-4 mb-4 backdrop-blur-sm border border-white/10">
                                   <h4 className="font-bold text-lg mb-2">Análise de Custo</h4>
                                   <p className="text-sm text-gray-200 whitespace-pre-wrap">{aiQuote.analysis}</p>
                               </div>
                               
                               <div>
                                   <h4 className="font-bold text-sm text-gray-400 mb-2 uppercase">Checklist de Qualidade</h4>
                                   <ul className="space-y-2">
                                       {aiQuote.checklist.slice(0, 4).map((item, idx) => (
                                           <li key={idx} className="flex items-start text-sm text-gray-300">
                                               <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0 mt-0.5" />
                                               <span>{item}</span>
                                           </li>
                                       ))}
                                   </ul>
                               </div>
                               <button 
                                    onClick={() => setAiQuote(null)}
                                    className="mt-6 text-xs text-gray-400 hover:text-white underline"
                               >
                                   Refazer Análise
                               </button>
                           </div>
                       )}
                   </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-blue-500 mr-2" />
                      Garantia Agência Maker
                  </h4>
                  <p className="text-sm text-gray-600">
                      Seus arquivos são protegidos e compartilhados apenas com o maker selecionado. Pagamento liberado apenas após aprovação da qualidade.
                  </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPrintJobPage;
