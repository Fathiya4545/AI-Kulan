import { useApp } from '../AppContext';

export default function JoinBanner() {
  const { openAuthModal } = useApp();

  return (
    <div className="join-banner">
      <span className="join-fold"></span>
      <span className="join-heart"></span>

      <img className="join-photo join-ring-pink" style={{ top: 22, left: '6%' }}
        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" alt="" />
      <img className="join-photo join-ring-purple" style={{ bottom: 22, left: '20%', width: 66, height: 66 }}
        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop" alt="" />
      <img className="join-photo join-ring-purple" style={{ top: 22, right: '8%' }}
        src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=200&h=200&fit=crop" alt="" />
      <img className="join-photo join-ring-green" style={{ bottom: 22, right: '18%', width: 66, height: 66 }}
        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop" alt="" />

      <span className="join-deco" style={{ top: '38%', left: '12%' }}>&#127760;</span>
      <span className="join-deco" style={{ top: '30%', right: '14%' }}>&#9835;</span>
      <span className="join-deco" style={{ bottom: '20%', right: '24%' }}>&#10022;</span>

      <span className="join-sticker-text" style={{ top: 6, right: '6%' }}>
        &#9733; MEET NEW<br />PEOPLE!
      </span>

      <h2>Join Kulan</h2>
      <p>
        People use Kulan to meet new people, learn new things, find support, get out of their
        comfort zones, and pursue their passions, together. Membership is free.
      </p>
      <a
        className="btn btn-dark"
        href="#"
        onClick={(e) => { e.preventDefault(); openAuthModal('signup'); }}
      >
        Sign up for free
      </a>
    </div>
  );
}
