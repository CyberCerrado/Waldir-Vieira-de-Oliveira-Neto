
import type { QuoteRequest, IntelligentQuote, QuoteDetails, Maker, MakerRecommendation } from '../types';

// Mock service to replace AI functionality

const fallbackQuote: IntelligentQuote = {
  analysis: "Estimativa calculada com base em parâmetros padrão de mercado.",
  checklist: [
      "Verificar integridade da malha (manifold)",
      "Confirmar espessura mínima de parede (0.8mm)",
      "Ajustar orientação para minimizar suportes"
  ]
};

export const getIntelligentPrice = async (request: Omit<QuoteRequest, 'files'>): Promise<IntelligentQuote> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simple logic to generate a "fake" price based on description length or randomness
  const basePrice = 45.00;
  const complexityFactor = request.description.length > 50 ? 1.5 : 1.0;
  const materialFactor = request.material === 'Resina' ? 1.8 : 1.0;
  
  const estimatedPrice = (basePrice * complexityFactor * materialFactor).toFixed(2);

  return {
      analysis: `Com base na descrição e no material selecionado (${request.material || 'PLA'}), estimamos o seguinte:\n\n- Tempo de impressão: ~4 a 8 horas\n- Peso estimado: ~60g - 120g\n- Complexidade: Média\n\nPreço Sugerido: R$ ${estimatedPrice}`,
      checklist: [
          "Verificar necessidade de suportes internos",
          "Checar tolerância dimensional para encaixes",
          "Garantir adesão à mesa (brim/raft)",
          "Inspecionar acabamento superficial pós-impressão"
      ]
  };
};

export const findMatchingMakers = async (request: QuoteDetails, makers: Maker[]): Promise<MakerRecommendation[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return the first 3 makers available as "recommended"
    const recommendations: MakerRecommendation[] = makers.slice(0, 3).map(maker => ({
        makerId: maker.id,
        justification: `Este maker possui equipamentos compatíveis e ótima avaliação para projetos de ${request.type === 'print' ? 'impressão' : 'modelagem'}.`
    }));

    return recommendations;
}

export const analyzeReverseEngineeringRequest = async (description: string): Promise<string> => {
     // Simulate network delay
     await new Promise(resolve => setTimeout(resolve, 1000));

    return `Análise Preliminar: O projeto descrito ("${description.substring(0, 30)}...") requer medição precisa com paquímetro ou scanner 3D. Recomendamos o uso de material ABS ou PETG devido à provável necessidade de resistência mecânica. Complexidade estimada: Média.`;
}
