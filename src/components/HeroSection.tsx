import React from 'react';
import { Zap, Shield, Download, ArrowRight, Code2, Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-20 sm:pt-24 pb-8 sm:pb-16 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-mesh">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 glass rounded-full text-xs sm:text-sm font-semibold text-violet-700 mb-6 sm:mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 mr-2 text-violet-500" />
            Built for Baseline Tooling Hackathon 2025
            <div className="w-2 h-2 bg-emerald-400 rounded-full ml-3 animate-pulse"></div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 mb-6 sm:mb-8 leading-tight">
            <span className="block">Check Your Code</span>
            <span className="block text-gradient animate-pulse-slow">
              Against Baseline
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed font-medium px-4">
            Instantly analyze your HTML, CSS, and JavaScript code to discover which features 
            are universally supported across all modern browsers. 
            <span className="text-violet-600 font-semibold">No backend required.</span>
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16 px-4">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative glass rounded-2xl p-6 sm:p-8 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform">
                  <Zap className="text-white" size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">
                  Real-time analysis as you type. No waiting, no loading screens, just instant feedback on your code compatibility.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative glass rounded-2xl p-6 sm:p-8 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform">
                  <Shield className="text-white" size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Privacy First</h3>
                <p className="text-gray-600 leading-relaxed">
                  Everything runs locally in your browser. Your code never leaves your device, ensuring complete privacy and security.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative glass rounded-2xl p-6 sm:p-8 hover:scale-105 transition-all duration-300 shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-6 transition-transform">
                  <Download className="text-white" size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Export Ready</h3>
                <p className="text-gray-600 leading-relaxed">
                  Generate detailed compatibility reports in JSON or Markdown format for documentation and team sharing.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative">
            <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Code2 className="text-violet-600" size={24} />
                <span className="text-base sm:text-lg font-semibold text-gray-900">Ready to analyze your code?</span>
              </div>
              <p className="text-gray-600 mb-6">
                Paste your HTML, CSS, or JavaScript below and get instant Baseline compatibility insights
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-violet-600 font-medium">
                <span>Scroll down to get started</span>
                <ArrowRight size={16} className="animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;