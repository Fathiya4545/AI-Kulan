import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';

export default function Header() {
  const {
    openAuthModal,
    showToast,
    user,
    logout,
    setSearchQuery,
    setActiveCategory,
    scrollToId,
  } = useApp();

  const [value, setValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function runSearch() {
    const term = value.trim();
    setActiveCategory(null);
    setSearchQuery(term);
    navigate('/');
    // Wait for the home page to mount before scrolling to the results.
    setTimeout(() => scrollToId('events-near'), 0);
    showToast(term ? `Searching events for "${term}"` : 'Showing all events');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') runSearch();
  }

  function go(path) {
    setMenuOpen(false);
    navigate(path);
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    showToast("You've been logged out");
    navigate('/');
  }

  return (
    <header>
      <Link className="logo" to="/">
        <span className="bubble">K</span> kulan
      </Link>

      <div className="search-wrap">
        <input
          type="text"
          placeholder="Search events..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span
          className="loc"
          role="button"
          tabIndex={0}
          onClick={() => showToast('Change location — coming soon')}
        >
          Minneapolis, MN
        </span>
        <span className="go" role="button" tabIndex={0} aria-label="Search" onClick={runSearch}>
          &#128269;
        </span>
      </div>

      <div className="header-right">
        <span
          className="lang"
          role="button"
          tabIndex={0}
          onClick={() => showToast('More languages coming soon')}
        >
          &#127760; English
        </span>

        {user ? (
          <div className="account-menu">
            <div
              className="account-pill"
              role="button"
              tabIndex={0}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="account-avatar">{user.name.charAt(0).toUpperCase()}</span>
              <span className="account-email">{user.name}</span>
            </div>
            {menuOpen && (
              <div className="account-dropdown">
                <span role="button" tabIndex={0} onClick={() => go('/events/new')}>
                  Create event
                </span>
                <span role="button" tabIndex={0} onClick={() => go('/my-events')}>
                  My events
                </span>
                <span role="button" tabIndex={0} onClick={() => go('/organizing')}>
                  Organized by me
                </span>
                <span role="button" tabIndex={0} onClick={handleLogout}>
                  Log out
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <span className="login" role="button" tabIndex={0} onClick={() => openAuthModal('login')}>
              Log in
            </span>
            <span className="signup" role="button" tabIndex={0} onClick={() => openAuthModal('signup')}>
              Sign up
            </span>
          </>
        )}
      </div>
    </header>
  );
}
