
import React from 'react';
import { CubeIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-maker-dark text-white mt-16">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <CubeIcon className="h-8 w-8 text-maker-secondary" />
            <span className="ml-2 text-xl font-bold">Agência Maker</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-maker-gray">&copy; {new Date().getFullYear()} Agência Maker. Todos os direitos reservados.</p>
            <p className="text-sm text-maker-gray">Conectando ideias à realidade em Rio Verde.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
