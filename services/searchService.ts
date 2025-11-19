
import { GoogleGenAI, Type } from "@google/genai";
import type { ExternalModel } from '../types';

const API_KEY = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

const generateImageUrl = (title: string) => {
    const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, "");
    const encodedPrompt = encodeURIComponent(`3d render of ${cleanTitle}, high quality 3d printing model, white background, product shot, studio lighting, photorealistic`);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=400&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
};

export const searchExternalModels = async (query: string): Promise<ExternalModel[]> => {
    if (!API_KEY) {
        console.warn("API Key missing for search service");
        return [];
    }

    const prompt = `
        Você é um motor de busca agregador de modelos 3D (como o Yeggi ou Thangs).
        O usuário está procurando por: "${query}".
        
        Gere uma lista de 6 resultados simulados altamente realistas que poderiam ser encontrados no Thingiverse, Cults3D, Printables ou MyMiniFactory.
        
        Retorne apenas os metadados.
        Diversifique as fontes.
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
                        results: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    source: { type: Type.STRING, enum: ['Thingiverse', 'Cults3D', 'Printables', 'MyMiniFactory'] },
                                    author: { type: Type.STRING },
                                    link: { type: Type.STRING },
                                    isFree: { type: Type.BOOLEAN }
                                },
                                required: ['id', 'title', 'source', 'author', 'link', 'isFree']
                            }
                        }
                    },
                    required: ['results']
                }
            }
        });

        const text = response.text.trim();
        const parsed = JSON.parse(text) as { results: Omit<ExternalModel, 'imageUrl'>[] };

        return parsed.results.map(item => ({
            ...item,
            imageUrl: generateImageUrl(item.title)
        }));

    } catch (error) {
        console.error("Error simulating search:", error);
        return [];
    }
};

export const getSuggestedModels = async (): Promise<ExternalModel[]> => {
    if (!API_KEY) return [];

    const prompt = `
        Gere uma lista curada de 6 modelos 3D populares e interessantes para imprimir hoje.
        Misture categorias: Utilidades para Casa, Decoração (Vases), Personagens Pop Geek, e Organizadores de Mesa.
        Os títulos devem ser em Inglês para garantir boas imagens, mas descritivos.
        Fontes variadas.
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
                        results: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    source: { type: Type.STRING, enum: ['Thingiverse', 'Cults3D', 'Printables', 'MyMiniFactory'] },
                                    author: { type: Type.STRING },
                                    link: { type: Type.STRING },
                                    isFree: { type: Type.BOOLEAN }
                                },
                                required: ['id', 'title', 'source', 'author', 'link', 'isFree']
                            }
                        }
                    },
                    required: ['results']
                }
            }
        });

        const text = response.text.trim();
        const parsed = JSON.parse(text) as { results: Omit<ExternalModel, 'imageUrl'>[] };

        return parsed.results.map(item => ({
            ...item,
            imageUrl: generateImageUrl(item.title)
        }));
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return [];
    }
}
