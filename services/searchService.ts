
import type { ExternalModel } from '../types';

// Hardcoded database of "fake" external models to simulate a search engine
const MOCK_DATABASE: ExternalModel[] = [
    { id: '1', title: 'Low Poly Pikachu', source: 'Thingiverse', author: 'flowalistik', link: 'https://www.thingiverse.com', isFree: true, imageUrl: '' },
    { id: '2', title: 'Articulated Dragon', source: 'Cults3D', author: 'McGybeer', link: 'https://cults3d.com', isFree: false, imageUrl: '' },
    { id: '3', title: 'Headphone Stand', source: 'Printables', author: 'MakerBot', link: 'https://www.printables.com', isFree: true, imageUrl: '' },
    { id: '4', title: 'Voronoi Vase', source: 'Thingiverse', author: 'architecture', link: 'https://www.thingiverse.com', isFree: true, imageUrl: '' },
    { id: '5', title: 'Cable Organizer', source: 'Printables', author: 'organizer_pro', link: 'https://www.printables.com', isFree: true, imageUrl: '' },
    { id: '6', title: 'Phone Stand Modular', source: 'MyMiniFactory', author: 'DesignStudio', link: 'https://www.myminifactory.com', isFree: true, imageUrl: '' },
    { id: '7', title: 'Raspberry Pi Case', source: 'Thingiverse', author: 'PiMaster', link: 'https://www.thingiverse.com', isFree: true, imageUrl: '' },
    { id: '8', title: 'Batman Bust', source: 'Cults3D', author: 'Eastman', link: 'https://cults3d.com', isFree: false, imageUrl: '' },
    { id: '9', title: 'Wall Planter', source: 'Printables', author: 'GreenThumb', link: 'https://www.printables.com', isFree: true, imageUrl: '' },
];

// Function to get a static placeholder image
const generateImageUrl = (title: string) => {
    const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, "");
    // Using a static placeholder service instead of AI generation
    return `https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(cleanTitle)}`;
};

export const searchExternalModels = async (query: string): Promise<ExternalModel[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerQuery = query.toLowerCase();
    
    // Filter mock database
    const results = MOCK_DATABASE.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.source.toLowerCase().includes(lowerQuery)
    );

    // Add images to results
    return results.map(item => ({
        ...item,
        imageUrl: generateImageUrl(item.title)
    }));
};

export const getSuggestedModels = async (): Promise<ExternalModel[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return a mix of the mock database
    const suggestions = [MOCK_DATABASE[0], MOCK_DATABASE[3], MOCK_DATABASE[5], MOCK_DATABASE[1], MOCK_DATABASE[8], MOCK_DATABASE[6]];

    return suggestions.map(item => ({
        ...item,
        imageUrl: generateImageUrl(item.title)
    }));
}
