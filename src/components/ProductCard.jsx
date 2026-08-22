import { Link } from 'react-router-dom';
import useItemsStore from '../store/useItemsStore';

// Takes only an id. The product data and the favorite state both come from the
// store via selectors, so nothing is drilled down as props.
export default function ProductCard({ id }) {
  const item = useItemsStore((s) => s.items.find((i) => i.id === id));
  const isFavorite = useItemsStore((s) => s.favorites.includes(id));
  const toggleFavorite = useItemsStore((s) => s.toggleFavorite);

  if (!item) return null;

  function handleFavorite(e) {
    // The card is a link, so stop the click from navigating away.
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  }

  return (
    <Link className="card product-card" to={`/items/${item.id}`}>
      <div className="thumb">
        <button
          type="button"
          className={`fav-btn${isFavorite ? ' is-favorite' : ''}`}
          onClick={handleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${item.title} from saved` : `Save ${item.title}`}
        >
          {isFavorite ? '★' : '☆'}
        </button>
        <img src={item.thumbnail} alt={item.title} />
      </div>
      <div className="body">
        <div className="title">{item.title}</div>
        <div className="meta">
          ${item.price} · {item.category}
        </div>
      </div>
    </Link>
  );
}
