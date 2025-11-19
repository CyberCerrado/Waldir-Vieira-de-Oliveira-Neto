import { GoogleGenAI, Type } from "@google/genai";
import type { QuoteRequest, IntelligentQuote, QuoteDetails, Maker, MakerRecommendation } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fallbackQuote: IntelligentQuote = {
  analysis: "Ocorreu um erro ao calcular o preço. Por favor, tente novamente.",
  checklist: []
};

export const getIntelligentPrice = async (request: Omit<QuoteRequest, 'files'>): Promise<IntelligentQuote> => {
  if (!API_KEY) return {
      analysis: "Serviço de precificação indisponível. API Key não configurada.",
      checklist: []
  };

  const prompt = `
    Você é um especialista em precificação de impressão e modelagem 3D para o mercado brasileiro, especificamente na região de Rio Verde, Goiás.
    Sua tarefa é analisar um pedido e fornecer uma estimativa de preço justa e um checklist de qualidade.

    Detalhes do Pedido:
    - Tipo de Serviço: ${request.type === 'print' ? 'Impressão 3D' : 'Modelagem 3D'}
    - Descrição: ${request.description}
    ${request.modelUrl ? `- URL do Modelo: ${request.modelUrl}` : ''}
    ${request.type === 'print' ? `- Material: ${request.material}` : ''}
    ${request.type === 'design' ? `- Complexidade: ${request.complexity}` : ''}

    Fatores a considerar:
    - Para impressões: peso do item, tipo de material, horas de impressão, desgaste da máquina, energia, taxa de mercado. Se uma URL for fornecida, use o título e as imagens para entender melhor a complexidade.
    - Para modelagem: complexidade, tempo estimado, nível técnico.
    - O preço final deve ser justo e competitivo, em Reais (BRL).

    Sua resposta DEVE ser um objeto JSON válido, sem nenhum texto ou formatação adicional. Siga estritamente a estrutura definida no schema.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    analysis: {
                        type: Type.STRING,
                        description: "Uma análise de custo detalhada, dividida por fatores, terminando com o preço final formatado como 'Preço Sugerido: R$ XXX,XX'."
                    },
                    checklist: {
                        type: Type.ARRAY,
                        description: "Uma lista de itens de verificação de qualidade relevantes para o projeto.",
                        items: { type: Type.STRING }
                    }
                },
                required: ['analysis', 'checklist']
            }
        }
    });
    
    const text = response.text.trim();
    return JSON.parse(text) as IntelligentQuote;

  } catch (error) {
    console.error("Error calling Gemini API for pricing:", error);
    return fallbackQuote;
  }
};

export const findMatchingMakers = async (request: QuoteDetails, makers: Maker[]): Promise<MakerRecommendation[]> => {
    if (!API_KEY) return [];

    const prompt = `
    Você é um gerente de projetos especialista em uma plataforma de fabricação 3D chamada "Agência Maker". Sua principal tarefa é conectar clientes com os makers mais adequados para seus projetos, com base na descrição do projeto e nos perfis dos makers disponíveis. Você deve analisar a solicitação do cliente e a lista de makers para fornecer até 3 recomendações.

    **Detalhes do Projeto do Cliente:**
    - Tipo de Serviço: ${request.type === 'print' ? 'Impressão 3D' : (request.type === 'design' ? 'Modelagem 3D' : 'Engenharia Reversa')}
    - Descrição: ${request.description}
    ${request.modelUrl ? `- URL do Modelo de Referência: ${request.modelUrl}` : ''}
    ${request.type === 'print' ? `- Material Solicitado: ${request.material}` : ''}
    ${request.type === 'design' ? `- Complexidade Estimada: ${request.complexity}` : ''}

    **Makers Disponíveis (JSON):**
    ${JSON.stringify(makers.map(({ id, name, roles, specialties, printers, services }) => ({ id, name, roles, specialties, printers, services })), null, 2)}

    **Sua Tarefa:**
    1. Analise cuidadosamente a descrição do projeto e seus requisitos (material, complexidade, tipo de serviço).
    2. Compare os requisitos com as especialidades, serviços, funções (roles) e equipamentos de cada maker.
    3. Selecione os 3 makers mais qualificados para este trabalho. Dê prioridade a makers com especialidades que correspondam diretamente à descrição do cliente.
    4. Para cada maker recomendado, escreva uma justificativa curta e convincente (em português), explicando por que ele é uma boa escolha para este projeto específico. A justificativa deve ser amigável e direcionada ao cliente.

    **Formato da Resposta:**
    Sua resposta DEVE ser um objeto JSON válido, sem nenhum texto ou formatação adicional, seguindo o schema definido.
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    makerId: { type: Type.STRING },
                                    justification: { type: Type.STRING }
                                },
                                required: ['makerId', 'justification']
                            }
                        }
                    },
                    required: ['recommendations']
                }
            }
        });

        const text = response.text.trim();
        const parsed = JSON.parse(text) as { recommendations: MakerRecommendation[] };
        return parsed.recommendations;
    } catch (error) {
        console.error("Error calling Gemini API for maker matching:", error);
        return [];
    }
}

export const analyzeReverseEngineeringRequest = async (description: string): Promise<string> => {
    if (!API_KEY) return "Serviço de análise indisponível. API Key não configurada.";

    const prompt = `
        Você é um engenheiro especialista em engenharia reversa e prototipagem.
        Analise a seguinte descrição de uma peça quebrada para um pedido de engenharia reversa.

        Descrição do Cliente: "${description}"

        Sua tarefa é:
        1. Identificar possíveis desafios técnicos na modelagem da peça.
        2. Sugerir os materiais mais adequados para a impressão 3D da peça final.
        3. Estimar a complexidade do projeto (Baixa, Média, Alta).
        4. Fornecer uma breve análise técnica para o maker que irá executar o projeto.

        Formate sua resposta em Português como um texto claro e conciso.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
// Fix: Added curly braces to the catch block to ensure proper error handling.
    } catch (error) {
        console.error("Error calling Gemini API for analysis:", error);
        return "Ocorreu um erro ao analisar a solicitação. Por favor, tente novamente.";
    }
}