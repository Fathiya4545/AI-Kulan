import { cities } from '../data/events';
import { useApp } from '../AppContext';

export default function PopularCities() {
  const { showToast } = useApp();

  function handleClick(name) {
    showToast(`Browsing events in ${name} — coming soon!`);
  }

  return (
    <section className="section" id="popular-cities">
      <div className="section-head">
        <h2>Popular cities on Kulan</h2>
      </div>
      <p className="cities-sub">
        Looking for fun things to do near you? See what Kulan organizers are planning in cities around the country.
      </p>
      <div className="grid grid-5">
        {cities.map((c, i) => (
          <div
            className="city-card"
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(c.name)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleClick(c.name); }}
          >
            <img src={c.img} alt={c.name} />
            <div className="city-name">{c.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
