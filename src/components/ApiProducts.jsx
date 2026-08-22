import { useEffect } from 'react';
import useItemsStore from '../store/useItemsStore';
import ProductCard from './ProductCard';

export default function ApiProducts() {
  // Each value is read with its own selector. No props are passed in, and none
  // are passed down — ProductCard subscribes to the store itself.
  const items = useItemsStore((s) => s.items);
  const status = useItemsStore((s) => s.status);
  const error = useItemsStore((s) => s.error);
  const favoriteCount = useItemsStore((s) => s.favorites.length);
  const loadItems = useItemsStore((s) => s.loadItems);

  useEffect(() => {
    // Only fetch on the first mount. Reading status through getState instead of
    // a selector keeps it out of the dependency list, so a later status change
    // doesn't retrigger the effect.
    if (useItemsStore.getState().status === 'idle') {
      loadItems();
    }
  }, [loadItems]);

  return (
    <section className="section" id="live-products">
      <div className="section-head">
        <h2>Trending finds (live from DummyJSON)</h2>
        <div className="head-actions">
          {favoriteCount > 0 && (
            <span className="fav-count">
              {favoriteCount} saved
            </span>
          )}
          <button
            type="button"
            className="see-all as-button"
            onClick={loadItems}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Loading…' : 'Reload'}
          </button>
        </div>
      </div>

      {status === 'loading' && <p className="empty-state">Loading products…</p>}
      {status === 'error' && (
        <p className="empty-state">Couldn't load products: {error}</p>
      )}

      {status === 'success' && (
        <div className="grid">
          {items.map((p) => (
            <ProductCard key={p.id} id={p.id} />
          ))}
        </div>
      )}
    </section>
  );
}
