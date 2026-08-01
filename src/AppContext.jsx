import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const AppCtx = createContext(null);
const STORAGE_KEY = 'kulan_user';

export function AppProvider({ children }) {
  const [authModal, setAuthModal] = useState(null); // 'signup' | 'login' | null
  const [toastMsg, setToastMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [user, setUser] = useState(null); // { email } | null
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // ignore malformed/unavailable storage
    }
  }, []);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2800);
  }, []);

  const openAuthModal = useCallback((mode) => setAuthModal(mode), []);
  const closeAuthModal = useCallback(() => setAuthModal(null), []);

  const login = useCallback((email) => {
    const account = { email };
    setUser(account);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    } catch {
      // storage unavailable — session-only login still works
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

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
    user, login, logout,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
