import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useApp } from '../AppContext';
import EventCard from '../components/EventCard';
import SignedOutNotice from '../components/SignedOutNotice';

export default function MyEvents() {
  const { userId, authLoading } = useApp();
  const events = useQuery(api.rsvps.myEvents, { userId: userId ?? undefined });

  if (authLoading) return <p className="empty-state">Loading…</p>;

  if (!userId) {
    return (
      <SignedOutNotice
        title="Log in to see your events"
        body="My Events shows everything you've joined, so you'll need an account first."
      />
    );
  }

  if (events === undefined) return <p className="empty-state">Loading your events…</p>;

  return (
    <div className="page">
      <h1 className="page-title">My events</h1>
      <p className="page-sub">Everything you've joined, soonest first.</p>

      {events.length === 0 ? (
        <p className="empty-state">
          You haven't joined anything yet.{' '}
          <Link className="inline-link" to="/">Find an event</Link> and hit Join.
        </p>
      ) : (
        <div className="grid">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              joined
              mine={userId === event.organizerId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
