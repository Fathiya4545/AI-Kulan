import { useState } from 'react';
import { useApp } from '../AppContext';
import useSlowLoad from '../lib/useSlowLoad';

export default function AuthModal() {
  const { authModal, closeAuthModal, openAuthModal, showToast, signUp, signIn } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const stuck = useSlowLoad(busy);

  if (!authModal) return null;
  const isSignup = authModal === 'signup';

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      if (isSignup) {
        const result = await signUp(name, email, password);
        showToast(`Welcome to Kulan, ${result.name}.`);
      } else {
        const result = await signIn(email, password);
        showToast(`Welcome back, ${result.name}.`);
      }
      setName('');
      setEmail('');
      setPassword('');
      closeAuthModal();
    } catch (err) {
      // Convex prefixes thrown errors, so trim it back to the readable part.
      const msg = String(err?.message ?? err);
      setError(msg.split('Uncaught Error:').pop().split(' at handler')[0].trim());
    } finally {
      setBusy(false);
    }
  }

  function switchMode(mode) {
    setError(null);
    openAuthModal(mode);
  }

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={closeAuthModal} aria-label="Close">
          &times;
        </button>
        <div className="modal-logo"><span className="bubble">K</span> kulan</div>
        <h2>{isSignup ? 'Join Kulan' : 'Welcome back'}</h2>
        <p className="modal-sub">
          {isSignup
            ? 'Create a free account to join events and host your own.'
            : 'Log in to see the events you joined and organized.'}
        </p>

        {error && <p className="form-error">{error}</p>}

        {stuck && (
          <p className="form-error">
            Still waiting on the database. Make sure <code>npx convex dev</code> is
            running in a terminal tab, then try again.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <label>
              Name
              <input
                type="text"
                required
                placeholder="Fathiya Yoosef"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-dark modal-submit" disabled={busy}>
            {busy ? 'Just a moment…' : isSignup ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <p className="modal-switch">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <span role="button" tabIndex={0} onClick={() => switchMode('login')}>Log in</span>
            </>
          ) : (
            <>
              New to Kulan?{' '}
              <span role="button" tabIndex={0} onClick={() => switchMode('signup')}>Sign up</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
