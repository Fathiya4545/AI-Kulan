import { useApp } from '../AppContext';

export default function EventsSection({ id, title, items, showFreeTag = false, gridClass = "", allowSeeAll = true }) {
  const { setSearchQuery, setActiveCategory, showToast } = useApp();

  function handleSeeAll(e) {
    e.preventDefault();
    setSearchQuery('');
    setActiveCategory(null);
    showToast('Showing all events');
  }

  return (
    <section className="section" id={id}>
      <div className="section-head">
        <h2>{title}</h2>
        {allowSeeAll && (
          <a className="see-all" href="#" onClick={handleSeeAll}>See all events</a>
        )}
      </div>
      {items.length === 0 ? (
        <p className="empty-state">No events match right now — try a different search or category.</p>
      ) : (
        <div className={`grid ${gridClass}`.trim()}>
          {items.map((e, i) => (
            <div className="card" key={i}>
              <div className="thumb">
                {showFreeTag && <span className="free-tag">Free</span>}
                <img src={e.img} alt="" />
              </div>
              <div className="body">
                <div className="title">{e.title}</div>
                <div className="meta">
                  {e.date}
                  <br />
                  {e.group}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
