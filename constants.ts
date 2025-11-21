
import type { Maker, PrintJob, Conversation } from './types';
import { UserRole as URole } from './types';

export const USER_ROLES_OPTIONS = [
  URole.MAKER,
  URole.DESIGNER,
  URole.SCANNER,
  URole.PAINTER,
  URole.ELECTRONICS,
  URole.MAINTENANCE,
];

export const MOCK_MAKERS: Maker[] = [
  {
    id: 'maker-1',
    name: 'Carlos Silva',
    email: 'carlos.silva@example.com',
    roles: [URole.MAKER, URole.DESIGNER],
    avatarUrl: 'https://picsum.photos/seed/carlos/200',
    rating: 4.9,
    reviews: 124,
    location: 'Rio Verde, GO',
    specialties: ['Prototipagem Rápida', 'Peças Automotivas'],
    isCertified: true,
    printers: [{ id: 'p1', name: 'Creality Ender 3', model: 'FDM', materialTypes: ['PLA', 'ABS', 'PETG'] }],
    portfolio: [
        { id: 'port1', imageUrl: 'https://picsum.photos/seed/port1/400/300', title: 'Engrenagem Industrial' },
        { id: 'port2', imageUrl: 'https://picsum.photos/seed/port2/400/300', title: 'Suporte para Drone' },
    ],
    services: ['Impressão 3D sob demanda', 'Modelagem 3D CAD', 'Engenharia Reversa'],
    software: ['SolidWorks', 'Fusion 360'],
    avgComplexityTime: '2-5 dias',
    basePrice: 150,
  },
  {
    id: 'maker-2',
    name: 'Ana Pereira',
    email: 'ana.pereira@example.com',
    roles: [URole.DESIGNER],
    avatarUrl: 'https://picsum.photos/seed/ana/200',
    rating: 5.0,
    reviews: 89,
    location: 'Rio Verde, GO',
    specialties: ['Design de Personagens', 'Acessibilidade'],
    isCertified: false,
    portfolio: [
        { id: 'port3', imageUrl: 'https://picsum.photos/seed/port3/400/300', title: 'Personagem para Jogo' },
        { id: 'port4', imageUrl: 'https://picsum.photos/seed/port4/400/300', title: 'Abridor de Garrafa Adaptado' },
    ],
    services: ['Modelagem 3D Orgânica', 'Consultoria de Design'],
    software: ['Blender', 'ZBrush'],
    avgComplexityTime: '3-7 dias',
    basePrice: 200,
  },
   {
    id: 'maker-3',
    name: 'João Mendes',
    email: 'joao.mendes@example.com',
    roles: [URole.MAKER],
    avatarUrl: 'https://picsum.photos/seed/joao/200',
    rating: 4.8,
    reviews: 210,
    location: 'Jataí, GO',
    specialties: ['Peças para o Agro', 'Grande Formato'],
    isCertified: false,
    printers: [
        { id: 'p2', name: 'Creality CR-10', model: 'FDM', materialTypes: ['PLA+', 'PETG'] },
        { id: 'p3', name: 'Anycubic Photon', model: 'SLA', materialTypes: ['Resina Padrão', 'Resina Rígida'] }
    ],
    services: ['Impressão 3D de alta precisão'],
  },
  // Novo Cliente para testes
  {
    id: 'client-1',
    name: 'Cliente UniRV',
    email: 'cliente@unirv.edu.br',
    roles: [URole.CLIENT],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    rating: 0,
    reviews: 0,
    location: 'Rio Verde, GO',
    specialties: [],
  }
];

export const MOCK_PRINT_JOBS: PrintJob[] = [
  {
    id: 'job-1',
    clientId: 'client-123',
    clientName: 'Mariana Lima',
    title: 'Suporte para Headset',
    description: 'Preciso de um suporte para headset para colocar na minha mesa. Encontrei o modelo no Thingiverse. Quero na cor preta.',
    material: 'PLA',
    color: 'Preto',
    fileUrl: 'https://www.thingiverse.com/thing:2098322',
    status: 'Aberto',
    paymentStatus: 'Pendente',
    price: 45.00,
    serviceFee: 6.75,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: 'job-2',
    clientId: 'client-456',
    clientName: 'Fazenda AgroTech',
    title: 'Clipe de Reposição para Pulverizador',
    description: 'O clipe que prende a mangueira do pulverizador quebrou. Preciso de uma réplica resistente. Anexei fotos e medidas.',
    material: 'PETG',
    color: 'Laranja',
    status: 'Em andamento',
    paymentStatus: 'Pago',
    price: 120.00,
    serviceFee: 18.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: 'job-3',
    clientId: 'client-789',
    clientName: 'Pedro Antunes',
    title: 'Caixa para componentes eletrônicos',
    description: 'Estou montando um projeto com Arduino e preciso de uma caixa personalizada para proteger os componentes. O design já está pronto em .STL.',
    material: 'ABS',
    color: 'Cinza Grafite',
    status: 'Aberto',
    paymentStatus: 'Pendente',
    price: 60.00,
    serviceFee: 9.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

export const EXTERNAL_3D_SITES = [
    { name: 'Thingiverse', url: 'https://www.thingiverse.com', logo: 'https://picsum.photos/seed/thingiverse/100' },
    { name: 'Cults3D', url: 'https://cults3d.com', logo: 'https://picsum.photos/seed/cults/100' },
    { name: 'Printables', url: 'https://www.printables.com', logo: 'https://picsum.photos/seed/printables/100' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'convo-1',
    participantIds: ['maker-1', 'maker-2'],
    messages: [
      { id: 'msg-1', senderId: 'maker-2', text: 'Oi Carlos, tudo bem? Vi seu novo projeto de engrenagem, ficou show!', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      { id: 'msg-2', senderId: 'maker-1', text: 'Olá Ana! Que bom que gostou. Deu um trabalhão pra modelar.', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
      { id: 'msg-3', senderId: 'maker-2', text: 'Imagino. Você tem alguma dica de filamento PETG que não entope muito?', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
    ],
  },
  {
    id: 'convo-2',
    participantIds: ['maker-1', 'maker-3'],
    messages: [
       { id: 'msg-4', senderId: 'maker-3', text: 'E aí, Carlos. A prefeitura entrou em contato sobre aquele projeto das lixeiras?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
       { id: 'msg-5', senderId: 'maker-1', text: 'Opa, João. Falaram comigo sim, passei seu contato pra eles verem a parte de impressão em grande formato.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString() },
    ]
  }
];
