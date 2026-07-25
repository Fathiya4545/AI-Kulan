import { useMemo } from 'react';
import { AppProvider, useApp } from './AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import EventsSection from './components/EventsSection';
import JoinBanner from './components/JoinBanner';
import Categories from './components/Categories';
import PopularCities from './components/PopularCities';
import HowItWorks from './components/HowItWorks';
import Friendships from './components/Friendships';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { events, onlineEvents } from './data/events';

function AppInner() {
  const { searchQuery, activeCategory } = useApp();

  const filteredEvents = useMemo(() => {
    let list = events;
    if (activeCategory) {
      list = list.filter((e) => e.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) => e.title.toLowerCase().includes(q) || e.group.toLowerCase().includes(q)
      );
    }
    return list;
  }, [searchQuery, activeCategory]);

  const eventsTitle = activeCategory
    ? <>Events in <span className="loc-edit">{activeCategory}</span></>
    : <>Events near <span className="loc-edit">Minneapolis, MN &#9998;</span></>;

  return (
    <>
      <Header />
      <Hero />
      <EventsSection
        id="events-near"
        title={eventsTitle}
        items={filteredEvents}
        showFreeTag
        gridClass=""
      />
      <EventsSection
        id="online-events"
        title="Upcoming online events"
        items={onlineEvents}
        gridClass="grid-3"
        allowSeeAll={false}
      />
      <JoinBanner />
      <Categories />
      <PopularCities />
      <HowItWorks />
      <Friendships />
      <Footer />
      <AuthModal />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
