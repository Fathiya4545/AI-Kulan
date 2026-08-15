import { useEffect, useState } from 'react';

// Convex queues queries and mutations while it's disconnected, so a stopped
// backend looks exactly like a slow one: nothing resolves, and the UI sits on
// "Loading…" forever. This flips to true once we've waited long enough that
// something is clearly wrong, so the UI can say so.
export default function useSlowLoad(isWaiting, delayMs = 6000) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!isWaiting) {
      setSlow(false);
      return;
    }

    const timer = setTimeout(() => setSlow(true), delayMs);
    return () => clearTimeout(timer);
  }, [isWaiting, delayMs]);

  return slow;
}
