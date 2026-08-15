import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';

export default function SignedOutNotice({ title, body }) {
  const { openAuthModal } = useApp();

  return (
    <div className="page signed-out">
      <h1 className="page-title">{title}</h1>
      <p className="page-sub">{body}</p>
      <div className="form-actions">
        <button type="button" className="btn btn-dark" onClick={() => openAuthModal('login')}>
          Log in
        </button>
        <button type="button" className="btn btn-outline" onClick={() => openAuthModal('signup')}>
          Sign up
        </button>
      </div>
      <p className="page-sub" style={{ marginTop: 24 }}>
        Or keep <Link className="inline-link" to="/">browsing events</Link> without an account.
      </p>
    </div>
  );
}
