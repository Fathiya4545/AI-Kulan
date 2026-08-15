import { useNavigate, useParams, Link } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useApp } from '../AppContext';
import EventForm from '../components/EventForm';
import SignedOutNotice from '../components/SignedOutNotice';

export default function EditEvent() {
  const { id } = useParams();
  const { userId, authLoading, showToast } = useApp();
  const event = useQuery(api.events.get, { eventId: id });
  const updateEvent = useMutation(api.events.update);
  const navigate = useNavigate();

  if (authLoading || event === undefined) {
    return <p className="empty-state">Loading…</p>;
  }

  if (!userId) {
    return (
      <SignedOutNotice
        title="Log in to edit this event"
        body="You need to be logged in as the organizer to make changes."
      />
    );
  }

  if (event === null) {
    return (
      <div className="page">
        <h1 className="page-title">Event not found</h1>
        <p className="page-sub">
          It may have been deleted. <Link className="inline-link" to="/">Browse other events</Link>.
        </p>
      </div>
    );
  }

  // The server enforces this too - this is just so the page doesn't waste
  // someone's time with a form they can't submit.
  if (event.organizerId !== userId) {
    return (
      <div className="page">
        <h1 className="page-title">This isn't your event</h1>
        <p className="page-sub">
          Only {event.organizerName} can edit it.{' '}
          <Link className="inline-link" to={`/events/${event._id}`}>Back to the event</Link>.
        </p>
      </div>
    );
  }

  async function handleSubmit(values) {
    await updateEvent({ ...values, eventId: event._id, userId });
    showToast('Changes saved.');
    navigate(`/events/${event._id}`);
  }

  return (
    <div className="page">
      <h1 className="page-title">Edit event</h1>
      <p className="page-sub">Anyone who joined will see the updated details.</p>
      <EventForm
        initial={{
          title: event.title,
          description: event.description,
          category: event.category,
          isOnline: event.isOnline,
          location: event.location,
          date: event.date,
          time: event.time,
          imageUrl: event.imageUrl,
        }}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/events/${event._id}`)}
      />
    </div>
  );
}
