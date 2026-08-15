import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const AppCtx = createContext(null);
const STORAGE_KEY = 'kulan_session';

export function AppProvider({ children }) {
  const [authModal, setAuthModal] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [format, setFormat] = useState('all'); // all | in-person | online
  const [userId, setUserId] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const toastTimer = useRef(null);

  const signUpMutation = useMutation(api.auth.signUp);
  const signInMutation = useMutation(api.auth.signIn);

  // Restore the stored session id on first load.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUserId(saved);
    } catch {
      // storage blocked - the app still works, just without a remembered login
    }
    setSessionChecked(true);
  }, []);

  // Confirm that stored id still matches a real user in the database.
  const user = useQuery(api.auth.me, sessionChecked ? { userId: userId ?? undefined } : 'skip');

  // If the row is gone (deleted user, wiped database), drop the stale session.
  useEffect(() => {
    if (userId && user === null) {
      setUserId(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, [userId, user]);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const openAuthModal = useCallback((mode) => setAuthModal(mode), []);
  const closeAuthModal = useCallback(() => setAuthModal(null), []);

  const persist = useCallback((id) => {
    setUserId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  }, []);

  const signUp = useCallback(
    async (name, email, password) => {
      const result = await signUpMutation({ name, email, password });
      persist(result.userId);
      return result;
    },
    [signUpMutation, persist]
  );

  const signIn = useCallback(
    async (email, password) => {
      const result = await signInMutation({ email, password });
      persist(result.userId);
      return result;
    },
    [signInMutation, persist]
  );

  const logout = useCallback(() => {
    setUserId(null);
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
    // auth
    user: user ?? null,
    userId: user ? user.userId : null,
    authLoading: !sessionChecked || (userId !== null && user === undefined),
    signUp,
    signIn,
    logout,
    authModal,
    openAuthModal,
    closeAuthModal,
    // browsing
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    format,
    setFormat,
    // ui
    toastMsg,
    showToast,
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
