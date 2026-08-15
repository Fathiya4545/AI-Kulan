import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useApp } from '../AppContext';
import EventCard from '../components/EventCard';
import SignedOutNotice from '../components/SignedOutNotice';

export default function Organizing() {
  const { userId, authLoading } = useApp();
  const events = useQuery(api.events.byOrganizer, { organizerId: userId ?? undefined });

  if (authLoading) return <p className="empty-state">Loading…</p>;

  if (!userId) {
    return (
      <SignedOutNotice
        title="Log in to manage your events"
        body="This page shows the events you created, and lets you edit or delete them."
      />
    );
  }

  if (events === undefined) return <p className="empty-state">Loading your events…</p>;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Organized by me</h1>
          <p className="page-sub">Only you can edit or delete these.</p>
        </div>
        <Link className="btn btn-dark" to="/events/new">+ Create event</Link>
      </div>

      {events.length === 0 ? (
        <p className="empty-state">
          You haven't created any events yet.{' '}
          <Link className="inline-link" to="/events/new">Host your first one</Link>.
        </p>
      ) : (
        <div className="grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} mine />
          ))}
        </div>
      )}
    </div>
  );
}
