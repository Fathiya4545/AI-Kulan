import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useApp } from '../AppContext';
import Hero from '../components/Hero';
import EventCard from '../components/EventCard';
import JoinBanner from '../components/JoinBanner';
import Categories from '../components/Categories';
import PopularCities from '../components/PopularCities';
import ApiProducts from '../components/ApiProducts';
import HowItWorks from '../components/HowItWorks';
import Friendships from '../components/Friendships';
import BackendWarning from '../components/BackendWarning';
import useSlowLoad from '../lib/useSlowLoad';

const FORMATS = [
  ['all', 'All'],
  ['in-person', 'In person'],
  ['online', 'Online'],
];

export default function Home() {
  const {
    searchQuery,
    activeCategory,
    setSearchQuery,
    setActiveCategory,
    format,
    setFormat,
    showToast,
    userId,
  } = useApp();

  // Guests can run this query too — no account needed to browse.
  // Search, category, and online/in-person are all applied on the server.
  const events = useQuery(api.events.list, {
    search: searchQuery || undefined,
    category: activeCategory ?? undefined,
    format,
  });

  // The "Upcoming online events" row keeps showing online events regardless of
  // the filter above it, the way it did in Week 12.
  const onlineEvents = useQuery(api.events.list, { format: 'online' });

  const joinedIds = useQuery(api.rsvps.joinedEventIds, { userId: userId ?? undefined });
  const joined = new Set(joinedIds ?? []);

  const loading = events === undefined;
  const backendDown = useSlowLoad(loading);

  function seeAll(e) {
    e.preventDefault();
    setSearchQuery('');
    setActiveCategory(null);
    setFormat('all');
    showToast('Showing all events');
  }

  function renderCards(list) {
    return list.map((event) => (
      <EventCard
        key={event._id}
        event={event}
        joined={joined.has(event._id)}
        mine={userId === event.organizerId}
      />
    ));
  }

  return (
    <>
      <Hero />

      <section className="section" id="events-near">
        <div className="section-head">
          <h2>
            {activeCategory ? (
              <>Events in <span className="loc-edit">{activeCategory}</span></>
            ) : (
              <>Events near <span className="loc-edit">Minneapolis, MN &#9998;</span></>
            )}
          </h2>

          <div className="head-actions">
            {FORMATS.map(([value, label]) => (
              <span
                key={value}
                role="button"
                tabIndex={0}
                className={`format-link${format === value ? ' active' : ''}`}
                onClick={() => setFormat(value)}
              >
                {label}
              </span>
            ))}
            <a className="see-all" href="#" onClick={seeAll}>See all events</a>
          </div>
        </div>

        {loading && !backendDown && <p className="empty-state">Loading events…</p>}
        {loading && backendDown && <BackendWarning />}

        {!loading && events.length === 0 && (
          <p className="empty-state">
            No events match right now — try a different search, category, or format.
          </p>
        )}

        {!loading && events.length > 0 && <div className="grid">{renderCards(events)}</div>}
      </section>

      <section className="section" id="online-events">
        <div className="section-head">
          <h2>Upcoming online events</h2>
        </div>

        {onlineEvents !== undefined && onlineEvents.length === 0 && (
          <p className="empty-state">No online events scheduled yet.</p>
        )}

        {onlineEvents !== undefined && onlineEvents.length > 0 && (
          <div className="grid grid-3">{renderCards(onlineEvents.slice(0, 3))}</div>
        )}
      </section>

      <JoinBanner />
      <Categories />
      <PopularCities />
      <ApiProducts />
      <HowItWorks />
      <Friendships />
    </>
  );
}
