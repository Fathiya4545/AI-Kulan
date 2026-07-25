import { useApp } from '../AppContext';

const cats = [
  {
    name: "Travel and Outdoor",
    color: "#2fa66b",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2fa66b" strokeWidth="1.8">
        <path d="M12 2l4 8h-3l4 7h-3l3 5H7l3-5H7l4-7H8l4-8z" />
      </svg>
    )
  },
  {
    name: "Social Activities",
    color: "#e8823a",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#e8823a" strokeWidth="1.8">
        <path d="M6 3l2 12a2 2 0 002 2h4a2 2 0 002-2l2-12" />
        <path d="M8 8h8" />
        <path d="M12 17v5" />
        <path d="M9 22h6" />
      </svg>
    )
  },
  {
    name: "Hobbies and Passions",
    color: "#3aa7c9",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#3aa7c9" strokeWidth="1.8">
        <path d="M12 2C7 2 3 5.5 3 10c0 3 2 4 4 4h1a2 2 0 012 2v1c0 2 1.5 3 4 3 5 0 8-4 8-9 0-5-4-9-10-9z" />
        <circle cx="7.5" cy="10.5" r="1" />
        <circle cx="12" cy="7" r="1" />
        <circle cx="16.5" cy="9" r="1" />
      </svg>
    )
  },
  {
    name: "Sports and Fitness",
    color: "#e8823a",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#e8823a" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v6l5 3" />
        <path d="M6 8l3 4-3 4" />
      </svg>
    )
  },
  {
    name: "Health and Wellbeing",
    color: "#8b5cf6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8">
        <path d="M9 3a5 5 0 000 10 5 5 0 000 8" />
        <path d="M15 21a5 5 0 000-10 5 5 0 000-8" />
      </svg>
    )
  }
];

export default function Categories() {
  const { activeCategory, setActiveCategory, setSearchQuery, showToast, scrollToId } = useApp();

  function handleClick(name) {
    const next = activeCategory === name ? null : name;
    setActiveCategory(next);
    setSearchQuery('');
    scrollToId('events-near');
    showToast(next ? `Filtering events: ${name}` : 'Showing all events');
  }

  return (
    <section className="section" id="categories">
      <div className="section-head" style={{ marginBottom: 24 }}>
        <h2>Explore top categories</h2>
      </div>
      <div className="grid grid-5">
        {cats.map((c, i) => (
          <div
            className={`cat-card${activeCategory === c.name ? ' active' : ''}`}
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(c.name)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleClick(c.name); }}
          >
            <div className="cat-name">{c.name}</div>
            <div className="cat-bottom">
              <span className="cat-arrow">&#8599;</span>
              <span className="cat-icon">{c.icon}</span>
            </div>
            <span className="cat-bar" style={{ background: c.color }}></span>
          </div>
        ))}
      </div>
    </section>
  );
}
