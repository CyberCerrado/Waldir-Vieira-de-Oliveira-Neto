
import React, { useState } from 'react';
import { QrCodeIcon, XIcon, CheckCircleIcon, ShieldCheckIcon } from './Icons';
import type { PrintJob } from '../types';

interface PaymentModalProps {
  job: PrintJob;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ job, onClose, onPaymentSuccess }) => {
  const [step, setStep] = useState<'breakdown' | 'pix' | 'success'>('breakdown');
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePix = () => {
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          setStep('pix');
      }, 1000);
  };

  const handleConfirmPayment = () => {
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          setStep('success');
          setTimeout(onPaymentSuccess, 2000);
      }, 1500);
  };

  const totalPrice = job.price || 0;
  const agencyFee = job.serviceFee || (totalPrice * 0.15);
  const makerValue = totalPrice - agencyFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-maker-dark">
              {step === 'breakdown' && 'Resumo do Pedido'}
              {step === 'pix' && 'Pagamento via PIX'}
              {step === 'success' && 'Pagamento Aprovado'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'breakdown' && (
            <div className="space-y-6">
               <div>
                   <p className="text-sm text-gray-500">Item</p>
                   <p className="font-bold text-maker-dark text-lg">{job.title}</p>
                   <p className="text-xs text-gray-400">{job.material} • {job.color}</p>
               </div>

               <div className="bg-blue-50 rounded-xl p-4 space-y-3 border border-blue-100">
                   <div className="flex justify-between text-sm text-gray-600">
                       <span>Valor da Produção (Maker)</span>
                       <span>R$ {makerValue.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-sm text-blue-600 font-medium">
                       <span>Taxa de Serviço (Agência)</span>
                       <span>R$ {agencyFee.toFixed(2)}</span>
                   </div>
                   <div className="border-t border-blue-200 pt-2 flex justify-between text-lg font-bold text-maker-dark">
                       <span>Total a Pagar</span>
                       <span>R$ {totalPrice.toFixed(2)}</span>
                   </div>
               </div>

               <div className="flex items-center text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
                   <ShieldCheckIcon className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                   <p>Seu dinheiro fica seguro com a Agência Maker até que você receba o produto.</p>
               </div>

               <button 
                onClick={handleGeneratePix}
                disabled={isLoading}
                className="w-full bg-maker-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center shadow-lg shadow-blue-900/20"
               >
                   {isLoading ? 'Gerando Cobrança...' : 'Gerar PIX para Pagamento'}
               </button>
            </div>
          )}

          {step === 'pix' && (
              <div className="text-center space-y-6">
                  <div className="bg-white border-2 border-maker-secondary rounded-xl p-4 inline-block shadow-sm">
                     <QrCodeIcon className="w-48 h-48 text-maker-dark" />
                  </div>
                  
                  <div>
                      <p className="text-sm text-gray-500 mb-2">Escaneie o QR Code ou copie o código abaixo:</p>
                      <div className="bg-gray-100 p-3 rounded-lg text-xs break-all font-mono text-gray-600 select-all border border-gray-200">
                          00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865406{totalPrice.toFixed(2).replace('.', '')}5802BR5913AGENCIA MAKER6009RIO VERDE62070503***6304
                      </div>
                  </div>

                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded font-medium">
                      Aguardando confirmação do banco...
                  </div>

                  <button 
                    onClick={handleConfirmPayment}
                    className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-900/20"
                   >
                       {isLoading ? 'Verificando...' : 'Já fiz o pagamento'}
                   </button>
              </div>
          )}

          {step === 'success' && (
              <div className="text-center py-8 space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircleIcon className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Pagamento Confirmado!</h3>
                  <p className="text-gray-600">O maker foi notificado e começará a produção da sua peça em breve.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
