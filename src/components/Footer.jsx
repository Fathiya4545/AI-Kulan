import { useApp } from '../AppContext';

export default function Footer() {
  const { openAuthModal, showToast, scrollToId } = useApp();

  const discoverActions = {
    Groups: () => showToast('Group directory coming soon'),
    Events: () => scrollToId('events-near'),
    Topics: () => scrollToId('categories'),
    Cities: () => scrollToId('popular-cities'),
    'Online events': () => scrollToId('online-events'),
    'Local guides': () => showToast('Local guides coming soon'),
    'Make friends': () => scrollToId('friendships'),
    Sitemap: () => showToast('Sitemap coming soon'),
  };

  const accountActions = {
    'Sign up': () => openAuthModal('signup'),
    'Log in': () => openAuthModal('login'),
    Help: () => showToast('Help center coming soon'),
  };

  const companyActions = {
    About: () => showToast('About Kulan — coming soon'),
    Blog: () => showToast('Blog coming soon'),
    'Kulan Pro': () => showToast('Kulan Pro — coming soon'),
    Careers: () => showToast('Careers page coming soon'),
    Apps: () => showToast('Mobile apps coming soon'),
    Podcast: () => showToast('Podcast coming soon'),
  };

  const legalActions = {
    'Terms of service': () => showToast('Terms of service — coming soon'),
    'Your privacy choices': () => showToast('Privacy choices — coming soon'),
    'Cookie policy': () => showToast('Cookie policy — coming soon'),
    'License attribution': () => showToast('License attribution — coming soon'),
    Help: () => showToast('Help center coming soon'),
  };

  function renderList(actions) {
    return Object.keys(actions).map((label) => (
      <li key={label} role="button" tabIndex={0} onClick={actions[label]} onKeyDown={(e) => { if (e.key === 'Enter') actions[label](); }}>
        {label}
      </li>
    ));
  }

  return (
    <footer>
      <div className="footer-top">
        <div className="footer-logo">
          <span className="bubble">K</span> kulan
          <span className="tag">The people platform</span>
        </div>
        <div className="footer-cta">
          <h3>Create your own Kulan group.</h3>
          <a
            className="btn"
            href="#"
            onClick={(e) => { e.preventDefault(); showToast('Group creation flow coming soon!'); }}
          >
            Get Started &#8594;
          </a>
        </div>
      </div>

      <div className="footer-cols">
        <div>
          <h4>Your account</h4>
          <ul>{renderList(accountActions)}</ul>
        </div>
        <div>
          <h4>Discover</h4>
          <ul>{renderList(discoverActions)}</ul>
        </div>
        <div>
          <h4>Kulan</h4>
          <ul>{renderList(companyActions)}</ul>
        </div>
        <div>
          <h4>Follow us</h4>
          <div className="social-icons">
            {['f', '𝕏', '▶', '📷', '♪'].map((icon, i) => (
              <span
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => showToast('Follow us — social links coming soon')}
              >
                {icon}
              </span>
            ))}
          </div>
          <h4 style={{ marginTop: 24 }}>Get the app</h4>
          <div className="app-badges">
            <span role="button" tabIndex={0} onClick={() => showToast('Coming soon to Google Play')}>
              &#9654; Google Play
            </span>
            <span role="button" tabIndex={0} onClick={() => showToast('Coming soon to the App Store')}>
              &#63743; App Store
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2026 Bending Spoons US Inc.</span>
        <div className="links">
          {Object.keys(legalActions).map((label) => (
            <span key={label} role="button" tabIndex={0} onClick={legalActions[label]}>
              {label}{label === 'Your privacy choices' ? ' ⊙' : ''}
            </span>
          ))}
        </div>
        <span>Made with &#10084; by BENDING SPOONS</span>
      </div>
    </footer>
  );
}
