const STORAGE_KEY = 'baseline-paste-check';
const HISTORY_KEY = 'baseline-history';
const BOOKMARKS_KEY = 'baseline-bookmarks';

export const saveToStorage = (code: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return '';
  }
};

export const getStoredHistory = (): any[] => {
  return getHistory();
};

export const addToHistory = (entry: any): any[] => {
  saveToHistory(entry);
  return getHistory();
};

export const saveToHistory = (entry: any): void => {
  try {
    const history = getHistory();
    const newHistory = [entry, ...history.filter(h => h.id !== entry.id)].slice(0, 50); // Keep last 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.warn('Failed to save to history:', error);
  }
};

export const getHistory = (): any[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    }
    return [];
  } catch (error) {
    console.warn('Failed to load history:', error);
    return [];
  }
};

export const getStoredBookmarks = (): any[] => {
  return getBookmarks();
};

export const saveBookmark = (bookmark: any): any[] => {
  try {
    const bookmarks = getBookmarks();
    const newBookmarks = [bookmark, ...bookmarks.filter(b => b.id !== bookmark.id)];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    return newBookmarks;
  } catch (error) {
    console.warn('Failed to save bookmark:', error);
    return getBookmarks();
  }
};

export const removeBookmark = (id: string): any[] => {
  try {
    const bookmarks = getBookmarks();
    const newBookmarks = bookmarks.filter(b => b.id !== id);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    return newBookmarks;
  } catch (error) {
    console.warn('Failed to remove bookmark:', error);
    return getBookmarks();
  }
};

export const getBookmarks = (): any[] => {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      return JSON.parse(stored).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    }
    return [];
  } catch (error) {
    console.warn('Failed to load bookmarks:', error);
    return [];
  }
};
export const encodeToHash = (code: string): void => {
  try {
    const encoded = btoa(encodeURIComponent(code));
    window.location.hash = `code=${encoded}`;
  } catch (error) {
    console.warn('Failed to encode to hash:', error);
  }
};

export const decodeFromHash = (): string => {
  try {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const encoded = params.get('code');
    if (encoded) {
      return decodeURIComponent(atob(encoded));
    }
  } catch (error) {
    console.warn('Failed to decode from hash:', error);
  }
  return '';
};