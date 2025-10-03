import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-violet-200/30" role="banner">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center animate-glow">
                <Sparkles className="text-white" size={24} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                Baseline Check
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Modern web compatibility analyzer
              </p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-3" role="navigation" aria-label="Header navigation">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
              Hackathon 2025
            </div>
            <a
              href="https://github.com/web-platform-dx/baseline-status"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 focus:bg-gray-800 transition-all duration-200 hover:scale-105 focus:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              aria-label="View Baseline Status Data on GitHub"
            >
              <ExternalLink size={16} />
              <span className="font-medium">Baseline Data</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;