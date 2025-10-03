import React, { useState, useCallback, useMemo } from 'react';
import { Upload, FileText, Code, AlertCircle, CheckCircle } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';

interface CodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  autoAnalyze?: boolean;
  showAdvanced?: boolean;
}

const detectLanguage = (code: string): string => {
  const trimmedCode = code.trim().toLowerCase();
  
  if (trimmedCode.includes('<!doctype') || trimmedCode.includes('<html') || 
      trimmedCode.includes('<div') || trimmedCode.includes('<span')) {
    return 'markup';
  }
  if (trimmedCode.includes('interface ') || trimmedCode.includes(': string') || 
      trimmedCode.includes(': number') || trimmedCode.includes('type ')) {
    return 'typescript';
  }
  if (trimmedCode.includes('import ') && (trimmedCode.includes('jsx') || 
      trimmedCode.includes('<') && trimmedCode.includes('>'))) {
    return 'jsx';
  }
  if (trimmedCode.includes('{') && (trimmedCode.includes('color:') || 
      trimmedCode.includes('margin:') || trimmedCode.includes('padding:'))) {
    return 'css';
  }
  return 'javascript';
};

const getLanguageLabel = (language: string): string => {
  const labels: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    jsx: 'JSX',
    css: 'CSS',
    markup: 'HTML'
  };
  return labels[language] || 'Code';
};

const CodeInput: React.FC<CodeInputProps> = ({ 
  code, 
  onCodeChange, 
  onAnalyze, 
  isAnalyzing,
  autoAnalyze = true,
  showAdvanced = false
}) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const detectedLanguage = useMemo(() => detectLanguage(code), [code]);
  const languageLabel = useMemo(() => getLanguageLabel(detectedLanguage), [detectedLanguage]);
  const characterCount = useMemo(() => code.length, [code]);

  const highlightCode = useCallback((code: string) => {
    try {
      const language = detectLanguage(code);
      return highlight(code, languages[language] || languages.javascript, language);
    } catch (error) {
      return code;
    }
  }, []);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('loading');
    setUploadError('');

    try {
      const text = await file.text();
      onCodeChange(text);
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2000);
    } catch (error) {
      setUploadError('Failed to read file. Please try again.');
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    }

    // Reset file input
    event.target.value = '';
  }, [onCodeChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      onAnalyze();
    }
  }, [onAnalyze]);

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Code className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Code Analysis</h2>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Paste your code or upload a file to analyze web platform features</p>
            </div>
          </div>
          
          {/* Language and Character Count Badge */}
          {code && (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {languageLabel}
              </span>
              <span className="text-xs text-gray-500 hidden sm:inline">
                {characterCount.toLocaleString()} chars
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Code Editor */}
      <div className="relative">
        <div className="bg-gray-900 text-gray-100 font-mono text-sm">
          <Editor
            value={code}
            onValueChange={onCodeChange}
            highlight={highlightCode}
            padding={16}
            onKeyDown={handleKeyDown}
            placeholder="✨ Paste your HTML, CSS, or JavaScript code here...

Examples:
• const element = document.querySelector('.my-class');
• fetch('/api/data').then(response => response.json());
• <div className='container'>Hello World</div>

💡 Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to analyze"
            style={{
              fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
              fontSize: 13,
              lineHeight: 1.5,
              minHeight: '250px',
              backgroundColor: '#1f2937',
              color: '#f9fafb',
            }}
            textareaClassName="focus:outline-none resize-none"
            aria-label="Code input editor"
            role="textbox"
            aria-multiline="true"
            aria-describedby="code-editor-help"
          />
        </div>

        {/* Upload Overlay */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
          <div className="relative">
            <label 
              htmlFor="file-upload" 
              className={`inline-flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 ${
                uploadStatus === 'loading' 
                  ? 'bg-blue-100 text-blue-700 cursor-not-allowed' 
                  : uploadStatus === 'success'
                  ? 'bg-green-100 text-green-700'
                  : uploadStatus === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
              }`}
              aria-label="Upload code file"
            >
              {uploadStatus === 'loading' && (
                <div className="animate-spin w-3 sm:w-4 h-3 sm:h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              )}
              {uploadStatus === 'success' && <CheckCircle size={14} />}
              {uploadStatus === 'error' && <AlertCircle size={14} />}
              {uploadStatus === 'idle' && <Upload size={14} />}
              
              <span className="font-medium hidden sm:inline">
                {uploadStatus === 'loading' && 'Uploading...'}
                {uploadStatus === 'success' && 'Uploaded!'}
                {uploadStatus === 'error' && 'Error'}
                {uploadStatus === 'idle' && 'Upload File'}
              </span>
              <span className="font-medium sm:hidden">
                {uploadStatus === 'loading' && '...'}
                {uploadStatus === 'success' && '✓'}
                {uploadStatus === 'error' && '✗'}
                {uploadStatus === 'idle' && 'Upload'}
              </span>
            </label>
            
            <input
              id="file-upload"
              type="file"
              accept=".js,.ts,.jsx,.tsx,.css,.html,.htm,.json"
              onChange={handleFileUpload}
              className="sr-only"
              disabled={uploadStatus === 'loading'}
              aria-describedby="file-upload-help"
            />
          </div>
        </div>
      </div>

      {/* Upload Error Message */}
      {uploadError && (
        <div className="px-4 sm:px-6 py-3 bg-red-50 border-t border-red-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Supports JS, TS, CSS, HTML files</span>
              <span className="sm:hidden">JS, TS, CSS, HTML</span>
            </div>
          </div>
          
          <button
            onClick={onAnalyze}
            disabled={!code.trim() || isAnalyzing}
            className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !code.trim() || isAnalyzing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : autoAnalyze 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm hover:shadow-md'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md'
            }`}
            aria-label={isAnalyzing ? 'Analyzing code...' : 'Analyze code for web platform features'}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                <span className="hidden sm:inline">Analyzing...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <Code className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{autoAnalyze ? 'Re-analyze' : 'Analyze Code'}</span>
                <span className="sm:hidden">Analyze</span>
              </>
            )}
          </button>
          
          {/* Advanced options */}
          {showAdvanced && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showPreview ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Toggle code preview"
              >
                <Eye size={14} />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Code Preview */}
      {showPreview && code && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Code Preview:</div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">{code.substring(0, 500)}{code.length > 500 && '...'}</pre>
          </div>
        </div>
      )}

      {/* Hidden help text for screen readers */}
      <div id="code-editor-help" className="sr-only">
        Code editor for analyzing web platform features. Supports JavaScript, TypeScript, CSS, and HTML. 
        Use Ctrl+Enter or Cmd+Enter to analyze the code.
      </div>
      <div id="file-upload-help" className="sr-only">
        Upload code files in JavaScript, TypeScript, CSS, or HTML format for analysis.
      </div>
    </div>
  );
};

export default CodeInput;