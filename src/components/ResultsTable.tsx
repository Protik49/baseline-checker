import React, { useState, useMemo, useCallback } from 'react';
import { CheckCircle, AlertTriangle, HelpCircle, BarChart3, Filter, Search, ArrowUpDown, ExternalLink, BookOpen } from 'lucide-react';
import { AnalysisResponse } from '../types';
import { getDocumentationUrl, getFeatureDisplayName } from '../utils/documentation';

interface ResultsTableProps {
  results: AnalysisResponse;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const [filter, setFilter] = useState<'all' | 'baseline' | 'needs-fallback' | 'unknown'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'feature' | 'status'>('status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  if (!results || results.features.length === 0) {
    return null;
  }

  const features = results.features;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'baseline':
        return <CheckCircle className="text-emerald-500" size={18} />;
      case 'needs-fallback':
        return <AlertTriangle className="text-amber-500" size={18} />;
      case 'unknown':
        return <HelpCircle className="text-gray-500" size={18} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'baseline':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            ✅ Baseline
          </span>
        );
      case 'needs-fallback':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            ⚠️ Needs Fallback
          </span>
        );
      case 'unknown':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
            ❓ Unknown
          </span>
        );
      default:
        return null;
    }
  };

  // Memoize filtered and sorted results to prevent recalculation on every render
  const filteredAndSortedResults = useMemo(() => {
    return features
    .filter(result => {
      if (filter !== 'all' && result.status !== filter) return false;
      if (searchTerm && !result.feature.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'status') {
        const statusOrder = { 'baseline': 0, 'needs-fallback': 1, 'unknown': 2 };
        const statusDiff = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
        if (statusDiff !== 0) return statusDiff;
      }
      return a.feature.localeCompare(b.feature);
    });
  }, [results, filter, searchTerm, sortBy]);

  // Memoize pagination
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedResults.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedResults, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedResults.length / itemsPerPage);

  // Memoize status counts
  const statusCounts = useMemo(() => features.reduce(
    (acc, result) => {
      acc[result.status]++;
      return acc;
    },
    { baseline: 0, 'needs-fallback': 0, unknown: 0 }
  ), [results]);

  // Reset to first page when filters change
  const handleFilterChange = useCallback((newFilter: typeof filter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((newSearch: string) => {
    setSearchTerm(newSearch);
    setCurrentPage(1);
  }, []);

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-purple-500/5 rounded-3xl blur-xl"></div>
      
      <div className="relative glass rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Feature Analysis Results</h2>
              <p className="text-gray-600">Detailed breakdown of detected web platform features</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-emerald-50/50 border-2 border-emerald-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="text-emerald-500" size={20} />
                    <span className="font-semibold text-emerald-800">Baseline</span>
                  </div>
                  <span className="text-3xl font-black text-emerald-900">{statusCounts.baseline}</span>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-amber-50/50 border-2 border-amber-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="text-amber-500" size={20} />
                    <span className="font-semibold text-amber-800">Needs Fallback</span>
                  </div>
                  <span className="text-3xl font-black text-amber-900">{statusCounts['needs-fallback']}</span>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-gray-50/50 border-2 border-gray-200/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="text-gray-500" size={20} />
                    <span className="font-semibold text-gray-800">Unknown</span>
                  </div>
                  <span className="text-3xl font-black text-gray-900">{statusCounts.unknown}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-500" size={16} />
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value as any)}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-colors font-medium"
                aria-label="Filter results by status"
              >
                <option value="all">All Features ({features.length})</option>
                <option value="baseline">Baseline ({statusCounts.baseline})</option>
                <option value="needs-fallback">Needs Fallback ({statusCounts['needs-fallback']})</option>
                <option value="unknown">Unknown ({statusCounts.unknown})</option>
              </select>
            </div>
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-colors"
                aria-label="Search features by name"
              />
            </div>
            
            <button
              onClick={() => setSortBy(sortBy === 'feature' ? 'status' : 'feature')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 rounded-xl transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label={`Sort by ${sortBy === 'feature' ? 'status' : 'feature name'}`}
            >
              <ArrowUpDown size={16} />
              <span>Sort by {sortBy === 'feature' ? 'Status' : 'Feature'}</span>
            </button>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {paginatedResults.length} of {filteredAndSortedResults.length} features
            {filteredAndSortedResults.length !== features.length && ` (filtered from ${features.length} total)`}
          </div>

          {/* Results Table */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl"></div>
            <div className="relative overflow-hidden border-2 border-gray-200/50 rounded-2xl">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50/80 backdrop-blur-sm">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Feature
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Baseline Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200/50">
                    {paginatedResults.map((result, index) => (
                      <tr key={index} className="hover:bg-violet-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {getStatusIcon(result.status)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-3">
                                <span className="text-base font-semibold text-gray-900 code-editor group-hover:text-violet-700 transition-colors">
                                  {getFeatureDisplayName(result.feature)}
                                </span>
                                {getDocumentationUrl(result.feature) && (
                                  <a
                                    href={getDocumentationUrl(result.feature)!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors group/link"
                                    title="View documentation"
                                    aria-label={`View documentation for ${result.feature}`}
                                  >
                                    <BookOpen size={12} />
                                    <span>Docs</span>
                                    <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                  </a>
                                )}
                              </div>
                              <code className="text-xs text-gray-500 font-mono mt-1 block">
                                {result.feature}
                              </code>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          {getStatusBadge(result.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredAndSortedResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 font-medium">No features match your current filter or search.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300 ${
                          currentPage === pageNum
                            ? 'bg-violet-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-violet-300"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;