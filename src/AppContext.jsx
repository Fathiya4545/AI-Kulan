import { createContext, useCallback, useContext, useRef, useState } from 'react';

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [authModal, setAuthModal] = useState(null); // 'signup' | 'login' | null
  const [toastMsg, setToastMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2800);
  }, []);

  const openAuthModal = useCallback((mode) => setAuthModal(mode), []);
  const closeAuthModal = useCallback(() => setAuthModal(null), []);

  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const value = {
    authModal, openAuthModal, closeAuthModal,
    toastMsg, showToast,
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    scrollToId,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
