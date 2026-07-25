import { useApp } from '../AppContext';

export default function HowItWorks() {
  const { scrollToId, showToast } = useApp();

  return (
    <section className="section how-wrap">
      <h2>How Kulan works</h2>
      <div className="how-steps">
        <svg className="how-connectors" viewBox="0 0 900 260" preserveAspectRatio="none">
          <path d="M290 90 C 380 40, 420 40, 480 90" stroke="#c9c9cd" strokeWidth="2" strokeDasharray="1 7" fill="none" strokeLinecap="round" />
          <path d="M480 220 C 460 260, 380 260, 300 200" stroke="#c9c9cd" strokeWidth="2" strokeDasharray="1 7" fill="none" strokeLinecap="round" />
          <path d="M300 200 l -10 -6 l 4 12 z" fill="#c9c9cd" />
          <path d="M480 90 l 10 -6 l -4 -12 z" fill="#c9c9cd" />
        </svg>

        <div className="how-step">
          <div className="icon">&#128269;</div>
          <h3>Discover events and groups</h3>
          <p>See who's hosting local events for all the things you love</p>
          <span
            className="link"
            role="button"
            tabIndex={0}
            onClick={() => { scrollToId('events-near'); showToast('Here are events near you'); }}
          >
            Start exploring
          </span>
        </div>

        <div className="how-step offset-down">
          <div className="icon">&#129309;</div>
          <h3>Find your people</h3>
          <p>Connect over shared interests, and enjoy meaningful experiences</p>
        </div>

        <div className="how-step" style={{ position: 'relative' }}>
          <span className="how-annotation" style={{ display: 'block', left: -70, top: 20 }}>
            &#128101;<br />FRIENDS, BUT<br />MAKE IT EASY
          </span>
          <div className="icon">&#127919;</div>
          <h3>Start a group to host events</h3>
          <p>Create your own Kulan group, and draw from a community of millions</p>
          <span
            className="link"
            role="button"
            tabIndex={0}
            onClick={() => showToast('Group creation flow coming soon!')}
          >
            Start group
          </span>
        </div>
      </div>
    </section>
  );
}
