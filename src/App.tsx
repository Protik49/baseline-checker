import React, { useState, useCallback, useMemo } from 'react';
import { Settings, History, Bookmark, Zap, ZapOff, ChevronDown, ChevronUp } from 'lucide-react';
import HeroSection from './components/HeroSection';
import DemoSection from './components/DemoSection';
import CodeInput from './components/CodeInput';
import AnalysisDetails from './components/AnalysisDetails';
import ResultsTable from './components/ResultsTable';
import ExportButtons from './components/ExportButtons';
import Footer from './components/Footer';
import { analyzeCode } from './utils/parser';
import { getStoredHistory, addToHistory, getStoredBookmarks, saveBookmark, removeBookmark } from './utils/storage';
import type { AnalysisResponse, HistoryItem, BookmarkItem } from './types';

function App() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [autoAnalysis, setAutoAnalysis] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => getStoredHistory());
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => getStoredBookmarks());

  const handleAnalyze = useCallback(async (inputCode?: string) => {
    const codeToAnalyze = inputCode || code;
    if (!codeToAnalyze.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisResult = await analyzeCode(codeToAnalyze);
      setResults(analysisResult);
      
      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        code: codeToAnalyze,
        results: analysisResult,
        timestamp: new Date().toISOString(),
        preview: codeToAnalyze.slice(0, 100) + (codeToAnalyze.length > 100 ? '...' : '')
      };
      
      const newHistory = addToHistory(historyItem);
      setHistory(newHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      setResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [code]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    if (autoAnalysis && newCode.trim()) {
      const timeoutId = setTimeout(() => {
        handleAnalyze(newCode);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [autoAnalysis, handleAnalyze]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setCode(item.code);
    setResults(item.results);
    setShowHistory(false);
  }, []);

  const handleBookmarkAdd = useCallback((name: string) => {
    if (!code.trim()) return;
    
    const bookmark: BookmarkItem = {
      id: Date.now().toString(),
      name,
      code,
      results,
      timestamp: new Date().toISOString(),
      preview: code.slice(0, 100) + (code.length > 100 ? '...' : '')
    };
    
    const newBookmarks = saveBookmark(bookmark);
    setBookmarks(newBookmarks);
  }, [code, results]);

  const handleBookmarkSelect = useCallback((bookmark: BookmarkItem) => {
    setCode(bookmark.code);
    setResults(bookmark.results);
    setShowBookmarks(false);
  }, []);

  const handleBookmarkRemove = useCallback((id: string) => {
    const newBookmarks = removeBookmark(id);
    setBookmarks(newBookmarks);
  }, []);

  const handleSampleCodeSelect = useCallback((sampleCode: string) => {
    setCode(sampleCode);
    handleAnalyze(sampleCode);

    // Scroll to code input section
    setTimeout(() => {
      const codeSection = document.querySelector('main');
      if (codeSection) {
        codeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [handleAnalyze]);

  const showResults = results && !isAnalyzing;
  const showControls = code.trim().length > 0;

  const fontSizeClass = useMemo(() => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  }, [fontSize]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${fontSizeClass}`}>
      <HeroSection />
      <DemoSection onCodeSelect={handleSampleCodeSelect} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        {/* Controls Bar - Sticky when analysis is active */}
        {showControls && (
          <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 mt-16 mb-6 sm:mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              {/* Font Size Controls */}
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-gray-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">Font:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                        fontSize === size
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Controls */}
              <div className="flex items-center gap-2  sm:gap-3">
                {/* Auto Analysis Toggle */}
                <button
                  onClick={() => setAutoAnalysis(!autoAnalysis)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    autoAnalysis
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {autoAnalysis ? <Zap size={14} /> : <ZapOff size={14} />}
                  <span className="hidden sm:inline">Auto</span>
                </button>

                {/* Advanced Mode Toggle */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span className="hidden sm:inline">Advanced</span>
                </button>

                {/* History Button */}
                <button
                  onClick={() => setShowHistory(true)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  <History size={14} />
                  <span className="hidden sm:inline">History</span>
                  {history.length > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {history.length > 9 ? '9+' : history.length}
                    </span>
                  )}
                </button>

                {/* Bookmarks Button */}
                <button
                  onClick={() => setShowBookmarks(true)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  <Bookmark size={14} />
                  <span className="hidden sm:inline">Saved</span>
                  {bookmarks.length > 0 && (
                    <span className="bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {bookmarks.length > 9 ? '9+' : bookmarks.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Code Analysis Section */}
        <section className="max-w-4xl mt-32 mx-auto space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Code Analysis
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Paste your HTML, CSS, or JavaScript code below for comprehensive analysis and insights.
            </p>
          </div>

          <CodeInput
            code={code}
            onChange={handleCodeChange}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            showAdvanced={showAdvanced}
            onBookmarkAdd={handleBookmarkAdd}
          />

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm sm:text-base">{error}</p>
            </div>
          )}

          {/* Results Section */}
          {showResults && (
            <div className="space-y-6 sm:space-y-8">
              <AnalysisDetails results={results} />
              <ResultsTable results={results} />
              <ExportButtons results={results} />
            </div>
          )}
        </section>
      </main>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Analysis History</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-96">
              {history.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No analysis history yet. Start analyzing code to see your history here.
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleHistorySelect(item)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.results.language}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{item.preview}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bookmarks Modal */}
      {showBookmarks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Saved Bookmarks</h3>
                <button
                  onClick={() => setShowBookmarks(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-96">
              {bookmarks.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No saved bookmarks yet. Use the bookmark button when analyzing code to save it here.
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {bookmark.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {bookmark.results?.language || 'Unknown'}
                          </span>
                          <button
                            onClick={() => handleBookmarkRemove(bookmark.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 truncate">{bookmark.preview}</p>
                      <button
                        onClick={() => handleBookmarkSelect(bookmark)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Load Code
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;