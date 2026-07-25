import { useApp } from '../AppContext';

function MotionMark() {
  return (
    <svg className="motion-mark" width="26" height="26" viewBox="0 0 26 26">
      <path d="M2 8 L14 2 M2 16 L16 10" stroke="#2b2b2b" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function MiniSquiggle({ flip }) {
  const d = flip
    ? "M35 0 C35 20, 5 20, 5 40 C5 55, 20 55, 20 60"
    : "M5 0 C5 20, 35 20, 35 40 C35 55, 20 55, 20 60";
  return (
    <svg className="squiggle" width="40" height="60" viewBox="0 0 40 60" fill="none" style={{ top: 150 }}>
      <path d={d} stroke="#c9c9cd" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
    </svg>
  );
}

export default function Hero() {
  const { openAuthModal } = useApp();

  return (
    <section className="hero">

      <div className="hero-decor left">
        <div className="blob-col">
          <MiniSquiggle />

          <div className="blob-wrap">
            <span className="blob-shape blob-lavender"></span>
            <MotionMark />
            <div className="blob-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=320&fit=crop"
                alt="Near you"
              />
            </div>
            <span className="sticker-label lavender">&#128205; NEAR YOU</span>
          </div>

          <div className="blob-wrap">
            <span className="blob-shape blob-pink"></span>
            <div className="blob-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&h=320&fit=crop"
                alt="Dance class"
              />
            </div>
            <span className="sticker-label pink">DANCE CLASS</span>
            <span className="music-note" style={{ bottom: -34, left: 70 }}>&#9834;&#9834;</span>
          </div>
        </div>
      </div>

      <div className="hero-decor right">
        <div className="blob-col right-col">
          <MiniSquiggle flip />

          <div className="blob-wrap">
            <span className="blob-shape blob-pink"></span>
            <MotionMark />
            <div className="blob-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=320&fit=crop"
                alt="Speaking club"
              />
            </div>
            <span className="sticker-label pink">SPEAKING CLUB</span>
          </div>

          <div className="blob-wrap">
            <span className="blob-shape blob-yellow"></span>
            <div className="blob-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=320&fit=crop"
                alt="Every thursday"
              />
            </div>
            <span className="sticker-label yellow">&#128197; EVERY THURSDAY</span>
          </div>
        </div>
      </div>

      <div className="hero-content">
        <h1>
          The <span className="accent">&#129309;</span> people platform.
          <br />
          Where <span className="accent">&#128161;</span> interests become{' '}
          <span className="accent">&#129309;</span> friendships.
        </h1>
        <p>
          Whatever your interest, from hiking and reading to networking and skill sharing,
          there are thousands of people who share it on Kulan. Events are happening every
          day—sign up to join the fun.
        </p>
        <a
          className="btn btn-dark"
          href="#"
          onClick={(e) => { e.preventDefault(); openAuthModal('signup'); }}
        >
          Join Kulan
        </a>
      </div>
    </section>
  );
}
