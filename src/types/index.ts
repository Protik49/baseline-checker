export interface BaselineFeature {
  [key: string]: boolean;
}

export interface AnalysisResult {
  feature: string;
  status: 'baseline' | 'needs-fallback' | 'unknown';
  found: boolean;
}

export interface AnalysisResponse {
  language: string;
  features: AnalysisResult[];
  summary: {
    total: number;
    baseline: number;
    needsFallback: number;
    unknown: number;
  };
}

export interface ExportData {
  timestamp: string;
  codeSnippet: string;
  results: AnalysisResult[];
}

export interface HistoryItem {
  id: string;
  code: string;
  results: AnalysisResponse;
  timestamp: string;
  preview: string;
}

export interface BookmarkItem {
  id: string;
  name: string;
  code: string;
  results: AnalysisResponse | null;
  timestamp: string;
  preview: string;
}