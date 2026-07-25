import { useState } from 'react';
import { useApp } from '../AppContext';

export default function AuthModal() {
  const { authModal, closeAuthModal, openAuthModal, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!authModal) return null;
  const isSignup = authModal === 'signup';

  function handleSubmit(e) {
    e.preventDefault();
    showToast(isSignup ? `Welcome to Kulan${email ? ', ' + email : ''}! Your account is ready.` : `Welcome back${email ? ', ' + email : ''}!`);
    setEmail('');
    setPassword('');
    closeAuthModal();
  }

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={closeAuthModal} aria-label="Close">&times;</button>
        <div className="modal-logo"><span className="bubble">K</span> kulan</div>
        <h2>{isSignup ? 'Join Kulan' : 'Welcome back'}</h2>
        <p className="modal-sub">
          {isSignup ? 'Create a free account to find your people.' : 'Log in to see your groups and events.'}
        </p>
        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-dark modal-submit">
            {isSignup ? 'Sign up' : 'Log in'}
          </button>
        </form>
        <p className="modal-switch">
          {isSignup ? (
            <>Already have an account?{' '}
              <span role="button" tabIndex={0} onClick={() => openAuthModal('login')}>Log in</span>
            </>
          ) : (
            <>New to Kulan?{' '}
              <span role="button" tabIndex={0} onClick={() => openAuthModal('signup')}>Sign up</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
