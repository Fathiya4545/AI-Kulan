import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useApp } from '../AppContext';
import EventForm from '../components/EventForm';
import SignedOutNotice from '../components/SignedOutNotice';

export default function CreateEvent() {
  const { userId, authLoading, showToast } = useApp();
  const createEvent = useMutation(api.events.create);
  const navigate = useNavigate();

  if (authLoading) return <p className="empty-state">Loading…</p>;

  if (!userId) {
    return (
      <SignedOutNotice
        title="Log in to host an event"
        body="Only members can create events on Kulan. Log in or sign up, then come back here."
      />
    );
  }

  async function handleSubmit(values) {
    const eventId = await createEvent({ ...values, organizerId: userId });
    showToast('Your event is live.');
    navigate(`/events/${eventId}`);
  }

  return (
    <div className="page">
      <h1 className="page-title">Create an event</h1>
      <p className="page-sub">
        You'll be listed as the organizer, and only you will be able to edit or delete it.
      </p>
      <EventForm
        submitLabel="Publish event"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}
