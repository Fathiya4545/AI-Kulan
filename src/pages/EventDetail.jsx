import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useApp } from '../AppContext';
import { formatEventDateLong } from '../lib/format';

export default function EventDetail() {
  const { id } = useParams();
  const { userId, user, openAuthModal, showToast } = useApp();
  const navigate = useNavigate();

  const event = useQuery(api.events.get, { eventId: id });
  const joined = useQuery(api.rsvps.isJoined, { eventId: id, userId: userId ?? undefined });

  const join = useMutation(api.rsvps.join);
  const leave = useMutation(api.rsvps.leave);
  const removeEvent = useMutation(api.events.remove);

  const [busy, setBusy] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (event === undefined) return <p className="empty-state">Loading event…</p>;

  if (event === null) {
    return (
      <div className="page">
        <h1 className="page-title">Event not found</h1>
        <p className="page-sub">
          It may have been deleted by its organizer.{' '}
          <Link className="inline-link" to="/">Browse other events</Link>.
        </p>
      </div>
    );
  }

  const isOrganizer = userId === event.organizerId;

  async function toggleJoin() {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setBusy(true);
    try {
      if (joined) {
        await leave({ eventId: event._id, userId });
        showToast(`You left ${event.title}.`);
      } else {
        await join({ eventId: event._id, userId });
        showToast(`You're going to ${event.title}.`);
      }
    } catch (err) {
      showToast(String(err?.message ?? err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await removeEvent({ eventId: event._id, userId });
      showToast('Event deleted.');
      navigate('/organizing');
    } catch (err) {
      showToast(String(err?.message ?? err));
      setBusy(false);
    }
  }

  return (
    <div className="page event-detail">
      <Link className="back-link" to="/">&larr; Back to events</Link>

      <img className="detail-hero" src={event.imageUrl} alt="" />

      <div className="detail-layout">
        <div className="detail-main">
          <span className={`format-tag static ${event.isOnline ? 'online' : 'in-person'}`}>
            {event.isOnline ? 'Online event' : 'In person'}
          </span>
          <h1 className="page-title">{event.title}</h1>
          <p className="detail-organizer">Hosted by {event.organizerName}</p>
          <p className="detail-desc">{event.description}</p>
        </div>

        <aside className="detail-side">
          <dl className="detail-facts">
            <div>
              <dt>When</dt>
              <dd>{formatEventDateLong(event.date, event.time)}</dd>
            </div>
            <div>
              <dt>{event.isOnline ? 'Meeting link' : 'Where'}</dt>
              <dd>{event.location}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{event.category}</dd>
            </div>
            <div>
              <dt>Going</dt>
              <dd>
                {event.attendeeCount} {event.attendeeCount === 1 ? 'person' : 'people'}
              </dd>
            </div>
          </dl>

          {isOrganizer ? (
            <div className="organizer-actions">
              <p className="organizer-note">You're organizing this event.</p>
              <Link className="btn btn-dark" to={`/events/${event._id}/edit`}>Edit event</Link>

              {confirmingDelete ? (
                <div className="confirm-box">
                  <p>Delete this event? Everyone who joined will lose their spot.</p>
                  <div className="form-actions">
                    <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={busy}>
                      {busy ? 'Deleting…' : 'Yes, delete'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setConfirmingDelete(false)}
                      disabled={busy}
                    >
                      Keep it
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete event
                </button>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                className={`btn ${joined ? 'btn-outline' : 'btn-dark'} join-btn`}
                onClick={toggleJoin}
                disabled={busy}
              >
                {busy ? 'Just a moment…' : joined ? "You're going · Leave event" : 'Join this event'}
              </button>
              {!user && (
                <p className="organizer-note">You'll be asked to log in first.</p>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
