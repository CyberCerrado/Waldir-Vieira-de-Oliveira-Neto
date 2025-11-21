
// Fix: Import React to resolve namespace error for React types.
import type React from 'react';

export enum UserRole {
  CLIENT = 'Cliente',
  MAKER = 'Maker (Fabricante)',
  DESIGNER = 'Projetista (Modelagem 3D)',
  SCANNER = 'Scanner 3D',
  PAINTER = 'Pintura e Acabamento',
  ELECTRONICS = 'Eletrônica Embarcada',
  MAINTENANCE = 'Manutenção de Impressoras',
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
}

export interface Printer {
  id:string;
  name: string;
  model: string;
  materialTypes: string[];
}

export interface Maker {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  avatarUrl: string;
  rating: number;
  reviews: number;
  location: string;
  specialties: string[];
  isCertified?: boolean;
  printers?: Printer[];
  portfolio?: { id: string; imageUrl: string; title: string }[];
  shop?: Product[];
  services?: string[];
  software?: string[];
  avgComplexityTime?: string;
  basePrice?: number;
  bio?: string;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  makerId: string;
}

export interface PrintJob {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  material: string;
  color: string;
  fileUrl?: string;
  status: 'Aberto' | 'Em andamento' | 'Concluído';
  paymentStatus: 'Pendente' | 'Pago';
  price: number;      // Total value charged to client
  serviceFee: number; // Platform revenue (e.g. 15%)
  createdAt: string; // ISO string
}

export interface QuoteDetails {
    type: 'print' | 'design' | 'reverse_eng';
    description: string;
    modelUrl?: string;
    material?: string;
    complexity?: 'low' | 'medium' | 'high';
    files?: File[];
}

export interface AdminStat {
    label: string;
    value: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string; // ISO string format
}

export interface Conversation {
  id: string;
  participantIds: string[];
  messages: ChatMessage[];
}

// Fix: Add missing types QuoteRequest, IntelligentQuote, and MakerRecommendation.
export interface QuoteRequest {
    type: 'print' | 'design' | 'reverse_eng';
    description: string;
    modelUrl?: string;
    material?: string;
    complexity?: 'low' | 'medium' | 'high';
    files?: File[];
}

export interface IntelligentQuote {
    analysis: string;
    checklist: string[];
    estimatedPrice: number; // Added numeric price for auto-fill
}

export interface MakerRecommendation {
    makerId: string;
    justification: string;
}

export interface ExternalModel {
  id: string;
  title: string;
  source: 'Thingiverse' | 'Cults3D' | 'Printables' | 'MyMiniFactory';
  imageUrl: string;
  author: string;
  link: string;
  isFree: boolean;
}
