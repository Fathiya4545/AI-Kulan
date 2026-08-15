import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Step 1 of the assignment: fetch a list from a real public API (DummyJSON)
// inside a single useEffect, and track loading / error / data as state.
export default function ApiProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('https://dummyjson.com/products?limit=8')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setProducts(data.products);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // avoid setting state on an unmounted component
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section" id="live-products">
      <div className="section-head">
        <h2>Trending finds (live from DummyJSON)</h2>
      </div>

      {loading && <p className="empty-state">Loading products…</p>}
      {error && <p className="empty-state">Couldn't load products: {error}</p>}

      {!loading && !error && (
        <div className="grid">
          {products.map((p) => (
            <Link className="card product-card" to={`/items/${p.id}`} key={p.id}>
              <div className="thumb">
                <img src={p.thumbnail} alt={p.title} />
              </div>
              <div className="body">
                <div className="title">{p.title}</div>
                <div className="meta">${p.price} · {p.category}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
