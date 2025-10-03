import React from 'react';
import { Heart, Zap, Github, ExternalLink, Award, Calendar } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      <div className="absolute inset-0 bg-mesh opacity-30"></div>
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Zap className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Baseline Check</h3>
                  <p className="text-gray-400">Modern web compatibility analyzer</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                A powerful developer tool that analyzes your code against browser Baseline support. 
                Built for the Baseline Tooling Hackathon 2025 with modern web technologies.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-violet-500/20 text-violet-300 rounded-xl border border-violet-500/30">
                  <Award size={16} />
                  <span className="text-sm font-medium">Hackathon Project</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">2025</span>
                </div>
              </div>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Resources</h4>
              <ul className="space-y-4">
                <li>
                  <a 
                    href="https://github.com/web-platform-dx/baseline-status" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                  >
                    <Github size={16} />
                    <span>Baseline Status Data</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://web.dev/articles/web-platform-dashboard-baseline" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                  >
                    <ExternalLink size={16} />
                    <span>Web Platform Dashboard</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://web-platform-dx.github.io/web-features/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                  >
                    <Zap size={16} />
                    <span>Web Features Explorer</span>
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Tech Stack */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Built With</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">React 18 + TypeScript</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-sm">Tailwind CSS</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                  <span className="text-sm">Vite + Lucide Icons</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm">Client-side Analysis</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-700/50 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-400">
                <span>Made with</span>
                <Heart className="text-red-400" size={16} />
                <span>for Baseline Tooling Hackathon 2025</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>© 2025 Baseline Check</span>
                <span>•</span>
                <span>Privacy-First Design</span>
                <span>•</span>
                <span>Open Source Inspired</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;