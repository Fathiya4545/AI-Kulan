import { Link } from 'react-router-dom';
import { formatEventDate } from '../lib/format';

// Same card shape as Week 12 — thumbnail with a corner tag, title, two-line meta.
// The corner tag now carries RSVP state instead of the old "Free" label.
export default function EventCard({ event, joined = false, mine = false }) {
  return (
    <Link className="card" to={`/events/${event._id}`}>
      <div className="thumb">
        {mine && <span className="free-tag">Organizing</span>}
        {!mine && joined && <span className="free-tag">Going</span>}
        <img src={event.imageUrl} alt="" />
      </div>
      <div className="body">
        <div className="title">{event.title}</div>
        <div className="meta">
          {formatEventDate(event.date, event.time)}
          <br />
          by {event.organizerName} · {event.attendeeCount} going
        </div>
      </div>
    </Link>
  );
}
