import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// From last week's assignment: fetch one item from a public API and read the
// id out of the URL with useParams.
export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setItem(null);

    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setItem(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="page">
      <Link className="back-link" to="/">&larr; Back to Kulan</Link>

      {loading && <p className="empty-state">Loading item…</p>}
      {error && <p className="empty-state">Couldn't load this item: {error}</p>}

      {item && (
        <div className="detail-card">
          <img src={item.thumbnail} alt={item.title} className="detail-image" />
          <div className="detail-body">
            <h1>{item.title}</h1>
            <p className="detail-price">${item.price}</p>
            <p className="detail-desc">{item.description}</p>
            <div className="detail-meta">
              <span>Category: {item.category}</span>
              <span>Rating: {item.rating} ★</span>
              <span>Stock: {item.stock}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
