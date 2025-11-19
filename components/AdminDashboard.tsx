
import React from 'react';
import type { AdminStat } from '../types';
// Fix: Corrected the import path for icons.
import { UsersIcon, PrinterIcon, CubeIcon, DollarSignIcon } from './Icons';

const MOCK_ADMIN_STATS: AdminStat[] = [
    { label: 'Makers Ativos', value: '47', icon: UsersIcon },
    { label: 'Impressoras Cadastradas', value: '82', icon: PrinterIcon },
    { label: 'Projetistas Ativos', value: '25', icon: UsersIcon },
    { label: 'Capacidade Produtiva (peças/mês)', value: '~1,200', icon: CubeIcon },
    { label: 'Pedidos em Andamento', value: '112', icon: CubeIcon },
    { label: 'Clientes Ativos', value: '350+', icon: UsersIcon },
    { label: 'Faturamento Mensal (est.)', value: 'R$ 25.000', icon: DollarSignIcon },
    { label: 'Produto Mais Vendido', value: 'Suporte de Celular', icon: CubeIcon },
];

const StatCard: React.FC<{ stat: AdminStat }> = ({ stat }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-maker-primary/10 p-3 rounded-full">
            <stat.icon className="h-8 w-8 text-maker-primary" />
        </div>
        <div>
            <p className="text-sm text-maker-gray">{stat.label}</p>
            <p className="text-2xl font-bold text-maker-dark">{stat.value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-maker-dark mb-6">Dashboard Administrativo</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {MOCK_ADMIN_STATS.map(stat => (
                    <StatCard key={stat.label} stat={stat} />
                ))}
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-maker-dark mb-4">Pedidos Recentes</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maker</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            {/* Fix: Corrected typo in className from divide-ray-200 to divide-gray-200 */}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[{id: '#123', client: 'Empresa X', maker: 'Carlos Silva', status: 'Em Produção'}, {id: '#124', client: 'Prefeitura', maker: 'João Mendes', status: 'Aguardando Aprovação'}, {id: '#125', client: 'Ana P.', maker: 'Carlos Silva', status: 'Concluído'}].map(order => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.client}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.maker}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* New Makers */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-xl font-bold text-maker-dark mb-4">Novos Makers</h3>
                     <ul className="space-y-4">
                        {[{name: 'Mariana Costa', role: 'Designer'}, {name: 'Lucas Ferreira', role: 'Fabricante'}].map(maker => (
                            <li key={maker.name} className="flex items-center space-x-3">
                                <img className="h-10 w-10 rounded-full" src={`https://picsum.photos/seed/${maker.name}/100`} alt={maker.name} />
                                <div>
                                    <p className="text-sm font-medium text-maker-dark">{maker.name}</p>
                                    <p className="text-sm text-maker-gray">{maker.role}</p>
                                </div>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;