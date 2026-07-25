import { useState } from 'react';
import { useApp } from '../AppContext';

export default function Header() {
  const { openAuthModal, setSearchQuery, setActiveCategory, showToast, scrollToId } = useApp();
  const [value, setValue] = useState('');

  function runSearch() {
    setActiveCategory(null);
    setSearchQuery(value.trim());
    scrollToId('events-near');
    showToast(value.trim() ? `Searching events for "${value.trim()}"` : 'Showing all events');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') runSearch();
  }

  return (
    <header>
      <a className="logo" href="#" onClick={(e) => e.preventDefault()}>
        <span className="bubble">K</span> kulan
      </a>
      <div className="search-wrap">
        <input
          type="text"
          placeholder="Search events..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span className="loc" role="button" tabIndex={0} onClick={() => showToast('Change location — coming soon')}>
          Minneapolis, MN
        </span>
        <span className="go" role="button" tabIndex={0} aria-label="Search" onClick={runSearch}>&#128269;</span>
      </div>
      <div className="header-right">
        <span className="lang" role="button" tabIndex={0} onClick={() => showToast('More languages coming soon')}>
          &#127760; English
        </span>
        <span className="login" role="button" tabIndex={0} onClick={() => openAuthModal('login')}>Log in</span>
        <span className="signup" role="button" tabIndex={0} onClick={() => openAuthModal('signup')}>Sign up</span>
      </div>
    </header>
  );
}
