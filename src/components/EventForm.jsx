import { useState } from 'react';
import { CATEGORIES } from '../lib/format';

const BLANK = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  isOnline: false,
  location: '',
  date: '',
  time: '',
  imageUrl: '',
};

export default function EventForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...BLANK, ...initial });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await onSubmit(values);
    } catch (err) {
      const msg = String(err?.message ?? err);
      setError(msg.split('Uncaught Error:').pop().split(' at handler')[0].trim());
      setBusy(false);
    }
  }

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      <label>
        Title
        <input
          type="text"
          required
          placeholder="Sunday morning book swap"
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
        />
      </label>

      <label>
        Description
        <textarea
          required
          rows={5}
          placeholder="What happens at this event, and what should people bring?"
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </label>

      <div className="form-row">
        <label>
          Category
          <select value={values.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          Format
          <select
            value={values.isOnline ? 'online' : 'in-person'}
            onChange={(e) => set('isOnline', e.target.value === 'online')}
          >
            <option value="in-person">In person</option>
            <option value="online">Online</option>
          </select>
        </label>
      </div>

      <label>
        {values.isOnline ? 'Meeting link' : 'Location'}
        <input
          type="text"
          required
          placeholder={values.isOnline ? 'https://meet.example.com/my-event' : 'Milkweed Books, Minneapolis, MN'}
          value={values.location}
          onChange={(e) => set('location', e.target.value)}
        />
      </label>

      <div className="form-row">
        <label>
          Date
          <input
            type="date"
            required
            value={values.date}
            onChange={(e) => set('date', e.target.value)}
          />
        </label>

        <label>
          Start time
          <input
            type="time"
            required
            value={values.time}
            onChange={(e) => set('time', e.target.value)}
          />
        </label>
      </div>

      <label>
        Cover image URL <span className="label-hint">(optional)</span>
        <input
          type="url"
          placeholder="https://images.unsplash.com/…"
          value={values.imageUrl}
          onChange={(e) => set('imageUrl', e.target.value)}
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-dark" disabled={busy}>
          {busy ? 'Saving…' : submitLabel}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
    </form>
  );
}
