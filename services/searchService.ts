
import { GoogleGenAI, Type } from "@google/genai";
import type { ExternalModel } from '../types';

const API_KEY = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

export const searchExternalModels = async (query: string): Promise<ExternalModel[]> => {
    if (!API_KEY) {
        console.warn("API Key missing for search service");
        return [];
    }

    const prompt = `
        Você é um motor de busca agregador de modelos 3D (como o Yeggi ou Thangs).
        O usuário está procurando por: "${query}".
        
        Gere uma lista de 6 resultados simulados altamente realistas que poderiam ser encontrados no Thingiverse, Cults3D, Printables ou MyMiniFactory.
        
        Retorne apenas os metadados (título, autor, fonte, etc). O link da imagem pode ser vazio pois será gerado via código.
        Diversifique as fontes (Thingiverse, Cults3D, Printables).
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
                                    imageUrl: { type: Type.STRING },
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
        const parsed = JSON.parse(text) as { results: ExternalModel[] };

        // Post-process to generate reliable, visual 3D images
        const resultsWithImages = parsed.results.map(item => {
            // Clean the title for the prompt
            const cleanTitle = item.title.replace(/[^a-zA-Z0-9 ]/g, "");
            const encodedPrompt = encodeURIComponent(`3d render of ${cleanTitle}, high quality 3d printing model, white background, product shot`);
            
            // Use Pollinations AI for dynamic image generation (free, no key required)
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=400&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;

            return {
                ...item,
                imageUrl: imageUrl
            };
        });

        return resultsWithImages;
    } catch (error) {
        console.error("Error simulating search:", error);
        return [];
    }
};
