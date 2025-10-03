import React from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import { AnalysisResponse } from '../types';
import { exportToJSON, exportToMarkdown } from '../utils/parser';

interface ExportButtonsProps {
  results: AnalysisResponse;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ results }) => {
  if (!results || results.features.length === 0) {
    return null;
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const content = exportToJSON(results);
    downloadFile(content, `baseline-report-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  const handleExportMarkdown = () => {
    const content = exportToMarkdown(results);
    downloadFile(content, `baseline-report-${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
  };

  const compatibilityScore = Math.round((results.summary.baseline / results.summary.total) * 100);

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-violet-500/5 rounded-3xl blur-xl"></div>
      
      <div className="relative glass rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Download className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Export & Share</h2>
              <p className="text-gray-600">Download reports or share your analysis with others</p>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900 mb-1">{results.summary.total}</div>
                <div className="text-sm font-medium text-gray-600">Features Detected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-600 mb-1">{compatibilityScore}%</div>
                <div className="text-sm font-medium text-gray-600">Baseline Compatible</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-violet-600 mb-1">{new Date().toLocaleDateString()}</div>
                <div className="text-sm font-medium text-gray-600">Analysis Date</div>
              </div>
            </div>
          </div>
          
          {/* Export Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              onClick={handleExportJSON}
              className="group relative overflow-hidden p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col items-center space-y-3">
                <FileJson size={24} />
                <span className="font-bold">Export JSON</span>
                <span className="text-xs opacity-90">Structured data format</span>
              </div>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="group relative overflow-hidden p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col items-center space-y-3">
                <FileText size={24} />
                <span className="font-bold">Export Markdown</span>
                <span className="text-xs opacity-90">Human-readable report</span>
              </div>
            </button>
          </div>

          {/* Export Info */}
          <div className="mt-8 p-6 bg-gradient-to-r from-violet-50/50 to-blue-50/50 rounded-2xl border border-violet-200/30">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
              <Download className="text-violet-600" size={18} />
              <span>Export Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-800 mb-1">JSON Export includes:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Complete analysis results</li>
                  <li>• Timestamp and metadata</li>
                  <li>• Feature statistics</li>
                  <li>• Language detection</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">Markdown Export includes:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Human-readable summary</li>
                  <li>• Categorized feature lists</li>
                  <li>• Status indicators</li>
                  <li>• Ready for documentation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportButtons;