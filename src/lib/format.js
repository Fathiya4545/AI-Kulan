export const CATEGORIES = [
  'Social Activities',
  'Sports and Fitness',
  'Hobbies and Passions',
  'Health and Wellbeing',
  'Travel and Outdoor',
];

// "2026-09-02" + "18:30"  ->  "Wed, Sep 2 · 6:30 PM"
export function formatEventDate(date, time) {
  if (!date) return '';

  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = (time || '00:00').split(':').map(Number);
  const d = new Date(year, month - 1, day, hour, minute);

  if (Number.isNaN(d.getTime())) return `${date} ${time}`.trim();

  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatEventDateLong(date, time) {
  if (!date) return '';

  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = (time || '00:00').split(':').map(Number);
  const d = new Date(year, month - 1, day, hour, minute);

  if (Number.isNaN(d.getTime())) return `${date} ${time}`.trim();

  return d.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
