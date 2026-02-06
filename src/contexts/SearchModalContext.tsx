import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';

const RECENTLY_VIEWED_KEY = 'search-recently-viewed';
const MAX_RECENT_VIEWS = 8;

export interface RecentView {
  path: string;
  labelKey: string;
  icon: 'inbox' | 'today' | 'completed' | 'settings';
}

const PATH_CONFIG: Record<string, { labelKey: string; icon: RecentView['icon'] }> = {
  '/inbox': { labelKey: 'sidebar.inbox', icon: 'inbox' },
  '/today': { labelKey: 'sidebar.today', icon: 'today' },
  '/completed': { labelKey: 'sidebar.completed', icon: 'completed' },
  '/settings': { labelKey: 'sidebar.settings', icon: 'settings' },
};

function loadRecentViews(): RecentView[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentView[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT_VIEWS) : [];
  } catch {
    return [];
  }
}

function saveRecentViews(views: RecentView[]) {
  try {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(views.slice(0, MAX_RECENT_VIEWS)));
  } catch {
    // ignore
  }
}

interface SearchModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  recentViews: RecentView[];
  recordRecentView: (path: string) => void;
}

const SearchModalContext = createContext<SearchModalContextType | undefined>(undefined);

export const SearchModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentViews, setRecentViews] = useState<RecentView[]>(loadRecentViews);

  useEffect(() => {
    saveRecentViews(recentViews);
  }, [recentViews]);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const recordRecentView = useCallback((path: string) => {
    const config = PATH_CONFIG[path];
    if (!config) return;
    setRecentViews((prev) => {
      const entry: RecentView = { path, labelKey: config.labelKey, icon: config.icon };
      const without = prev.filter((v) => v.path !== path);
      return [entry, ...without].slice(0, MAX_RECENT_VIEWS);
    });
  }, []);

  const value = useMemo(
    () => ({ isOpen, openModal, closeModal, recentViews, recordRecentView }),
    [isOpen, openModal, closeModal, recentViews, recordRecentView]
  );

  return (
    <SearchModalContext.Provider value={value}>
      {children}
    </SearchModalContext.Provider>
  );
};

export const useSearchModal = () => {
  const context = useContext(SearchModalContext);
  if (context === undefined) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return context;
};
