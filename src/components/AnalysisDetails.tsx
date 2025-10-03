import React, { useMemo } from 'react';
import { TrendingUp, Shield, AlertTriangle, Info, Target, Globe, Award, Lightbulb } from 'lucide-react';
import { AnalysisResponse } from '../types';

interface AnalysisDetailsProps {
  results: AnalysisResponse;
}

const AnalysisDetails: React.FC<AnalysisDetailsProps> = ({ results }) => {
  // Memoize expensive calculations
  const analysisData = useMemo(() => {
    if (!results || results.features.length === 0) return null;

  const baselineFeatures = results.features.filter(r => r.status === 'baseline');
  const fallbackFeatures = results.features.filter(r => r.status === 'needs-fallback');
  const unknownFeatures = results.features.filter(r => r.status === 'unknown');

  const compatibilityScore = Math.round((results.summary.baseline / results.summary.total) * 100);

    return {
      baselineFeatures,
      fallbackFeatures,
      unknownFeatures,
      compatibilityScore
    };
  }, [results]);

  if (!analysisData) {
    return null;
  }

  const { baselineFeatures, fallbackFeatures, unknownFeatures, compatibilityScore } = analysisData;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'from-emerald-500 to-teal-600';
    if (score >= 70) return 'from-blue-500 to-indigo-600';
    if (score >= 50) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 85) return "Outstanding! Your code is highly compatible with modern browsers.";
    if (score >= 70) return "Great job! Most features are well-supported across browsers.";
    if (score >= 50) return "Good foundation with room for improvement in browser compatibility.";
    return "Consider adding fallbacks to improve cross-browser compatibility.";
  };

  // Memoize recommendations
  const recommendations = useMemo(() => {
    const recommendations = [];
    
    if (fallbackFeatures.length > 0) {
      recommendations.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Fallback Strategy Needed',
        description: `${fallbackFeatures.length} features require polyfills or progressive enhancement for optimal browser support.`,
        features: fallbackFeatures.slice(0, 4).map(f => f.feature),
        action: 'Consider implementing feature detection and fallbacks'
      });
    }
    
    if (unknownFeatures.length > 0) {
      recommendations.push({
        type: 'info',
        icon: Info,
        title: 'Research Required',
        description: `${unknownFeatures.length} features are not in our Baseline dataset. Manual browser support verification recommended.`,
        features: unknownFeatures.slice(0, 4).map(f => f.feature),
        action: 'Check MDN Web Docs or Can I Use for detailed support info'
      });
    }
    
    if (baselineFeatures.length > 0) {
      recommendations.push({
        type: 'success',
        icon: Award,
        title: 'Excellent Browser Support',
        description: `${baselineFeatures.length} features are Baseline-supported, ensuring consistent behavior across all modern browsers.`,
        features: baselineFeatures.slice(0, 4).map(f => f.feature),
        action: 'These features are safe to use without fallbacks'
      });
    }
    
    return recommendations;
  }, [baselineFeatures, fallbackFeatures, unknownFeatures]);

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/5 via-blue-500/5 to-cyan-500/5 rounded-3xl blur-xl"></div>
      
      <div className="relative glass rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analysis Insights</h2>
              <p className="text-gray-600">Detailed breakdown of your code's browser compatibility</p>
            </div>
          </div>

          {/* Compatibility Score Section */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl"></div>
            <div className="relative p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  {/* Outer ring */}
                  <div className="w-32 h-32 rounded-full bg-gray-200"></div>
                  {/* Progress ring */}
                  <div 
                    className={`absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r ${getScoreBg(compatibilityScore)} opacity-20`}
                    style={{
                      background: `conic-gradient(from 0deg, rgb(139 92 246) 0%, rgb(59 130 246) ${compatibilityScore}%, rgb(229 231 235) ${compatibilityScore}%, rgb(229 231 235) 100%)`,
                      borderRadius: '50%'
                    }}
                    role="progressbar"
                    aria-valuenow={compatibilityScore}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Baseline compatibility score: ${compatibilityScore}%`}
                  ></div>
                  {/* Inner circle */}
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <div className={`text-3xl font-black ${getScoreColor(compatibilityScore)}`}>
                        {compatibilityScore}%
                      </div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Compatible
                      </div>
                    </div>
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Target className="text-white" size={16} />
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Baseline Compatibility Score</h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                {getScoreMessage(compatibilityScore)}
              </p>
            </div>
          </div>

          {/* Feature Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-emerald-50/50 border-2 border-emerald-200/50 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Shield className="text-emerald-600" size={20} />
                    </div>
                    <span className="font-semibold text-emerald-800">Baseline Ready</span>
                  </div>
                  <span className="text-3xl font-black text-emerald-900">{baselineFeatures.length}</span>
                </div>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  Features with universal browser support. Safe to use without polyfills or fallbacks.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-amber-50/50 border-2 border-amber-200/50 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="text-amber-600" size={20} />
                    </div>
                    <span className="font-semibold text-amber-800">Needs Attention</span>
                  </div>
                  <span className="text-3xl font-black text-amber-900">{fallbackFeatures.length}</span>
                </div>
                <p className="text-sm text-amber-700 leading-relaxed">
                  Features with limited support. Consider progressive enhancement or polyfills.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-gray-50/50 border-2 border-gray-200/50 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Info className="text-gray-600" size={20} />
                    </div>
                    <span className="font-semibold text-gray-800">Unknown Status</span>
                  </div>
                  <span className="text-3xl font-black text-gray-900">{unknownFeatures.length}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Features not in our dataset. Manual research recommended for browser support.
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Lightbulb className="text-violet-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Smart Recommendations</h3>
              </div>
              
              <div className="space-y-4">
                {recommendations.map((rec, index) => {
                  const IconComponent = rec.icon;
                  return (
                    <div
                      key={index}
                      className={`relative group rounded-2xl p-6 border-2 transition-all duration-200 hover:scale-[1.02] ${
                        rec.type === 'success' 
                          ? 'bg-emerald-50/50 border-emerald-200/50 hover:border-emerald-300' 
                          : rec.type === 'warning'
                          ? 'bg-amber-50/50 border-amber-200/50 hover:border-amber-300'
                          : 'bg-blue-50/50 border-blue-200/50 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                          rec.type === 'success' 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : rec.type === 'warning'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          <IconComponent size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-lg font-bold mb-2 ${
                            rec.type === 'success' 
                              ? 'text-emerald-800' 
                              : rec.type === 'warning'
                              ? 'text-amber-800'
                              : 'text-blue-800'
                          }`}>
                            {rec.title}
                          </h4>
                          <p className={`text-sm mb-4 leading-relaxed ${
                            rec.type === 'success' 
                              ? 'text-emerald-700' 
                              : rec.type === 'warning'
                              ? 'text-amber-700'
                              : 'text-blue-700'
                          }`}>
                            {rec.description}
                          </p>
                          
                          {rec.features.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {rec.features.map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                      rec.type === 'success' 
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                        : rec.type === 'warning'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                                    }`}
                                  >
                                    <code className="font-mono">{feature}</code>
                                  </span>
                                ))}
                                {rec.features.length < (rec.type === 'success' ? baselineFeatures.length : rec.type === 'warning' ? fallbackFeatures.length : unknownFeatures.length) && (
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                    +{(rec.type === 'success' ? baselineFeatures.length : rec.type === 'warning' ? fallbackFeatures.length : unknownFeatures.length) - rec.features.length} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className={`text-xs font-medium ${
                            rec.type === 'success' 
                              ? 'text-emerald-600' 
                              : rec.type === 'warning'
                              ? 'text-amber-600'
                              : 'text-blue-600'
                          }`}>
                            💡 {rec.action}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Baseline Information */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-blue-500/5 rounded-2xl"></div>
            <div className="relative p-6 rounded-2xl border border-violet-200/30">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Globe className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Understanding Baseline</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Baseline identifies web platform features that work reliably across all major browsers. 
                    When a feature becomes "Baseline", you can use it confidently in production without worrying about compatibility issues.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-medium text-emerald-800">✅ Baseline = Universal support</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-sm font-medium text-amber-800">⚠️ Limited = Needs fallbacks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetails;