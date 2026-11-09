import { useMemo, useState } from 'react';

const productCatalog = [
  {
    id: 1,
    name: 'Baguio Strawberry Treat Box',
    region: 'Cordillera Administrative Region',
    island: 'Luzon',
    origin: 'Baguio City',
    price: 520,
    rating: 4.9,
    badge: 'Best Seller',
    image: '🍓',
    accent: 'linear-gradient(135deg, #fda4af 0%, #f97316 100%)',
  },
  {
    id: 2,
    name: 'Pampanga Chicharon Crate',
    region: 'Central Luzon',
    island: 'Luzon',
    origin: 'San Fernando',
    price: 450,
    rating: 4.8,
    badge: 'Featured',
    image: '🥨',
    accent: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  },
  {
    id: 3,
    name: 'Bicol Pili Nut Gift Set',
    region: 'Bicol Region',
    island: 'Luzon',
    origin: 'Legazpi',
    price: 680,
    rating: 4.9,
    badge: 'Top Rated',
    image: '🌰',
    accent: 'linear-gradient(135deg, #a3e635 0%, #65a30d 100%)',
  },
  {
    id: 4,
    name: 'Cebu Otap Sampler',
    region: 'Central Visayas',
    island: 'Visayas',
    origin: 'Cebu City',
    price: 390,
    rating: 4.7,
    badge: 'Local Favorite',
    image: '🍪',
    accent: 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)',
  },
  {
    id: 5,
    name: 'Davao Durian Pastillas',
    region: 'Davao Region',
    island: 'Mindanao',
    origin: 'Davao City',
    price: 590,
    rating: 4.8,
    badge: 'Limited Batch',
    image: '🍈',
    accent: 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)',
  },
  {
    id: 6,
    name: 'Iloilo Barquillos Jar',
    region: 'Western Visayas',
    island: 'Visayas',
    origin: 'Iloilo',
    price: 320,
    rating: 4.6,
    badge: 'Freshly Baked',
    image: '🥐',
    accent: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
  },
  {
    id: 7,
    name: 'Ilocos Empanada Box',
    region: 'Ilocos Region',
    island: 'Luzon',
    origin: 'Vigan',
    price: 420,
    rating: 4.7,
    badge: 'Heritage Pick',
    image: '🥟',
    accent: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)',
  },
  {
    id: 8,
    name: 'Zamboanga Pastil Set',
    region: 'Zamboanga Peninsula',
    island: 'Mindanao',
    origin: 'Zamboanga City',
    price: 610,
    rating: 4.9,
    badge: 'Chef Pick',
    image: '🍲',
    accent: 'linear-gradient(135deg, #99f6e4 0%, #14b8a6 100%)',
  },
  {
    id: 9,
    name: 'Tagaytay Tablea Delights',
    region: 'Calabarzon',
    island: 'Luzon',
    origin: 'Tagaytay',
    price: 540,
    rating: 4.8,
    badge: 'Premium',
    image: '🍫',
    accent: 'linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)',
  },
  {
    id: 10,
    name: 'Leyte Rosquillos Tin',
    region: 'Eastern Visayas',
    island: 'Visayas',
    origin: 'Tacloban',
    price: 280,
    rating: 4.5,
    badge: 'Budget Pick',
    image: '🥮',
    accent: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
  },
  {
    id: 11,
    name: 'Cagayan de Oro Lanzones Basket',
    region: 'Northern Mindanao',
    island: 'Mindanao',
    origin: 'Cagayan de Oro',
    price: 470,
    rating: 4.7,
    badge: 'Family Pack',
    image: '🍋',
    accent: 'linear-gradient(135deg, #bef264 0%, #84cc16 100%)',
  },
  {
    id: 12,
    name: 'Bohol Peanut Kisses',
    region: 'Central Visayas',
    island: 'Visayas',
    origin: 'Bohol',
    price: 360,
    rating: 4.6,
    badge: 'Fresh Batch',
    image: '🥜',
    accent: 'linear-gradient(135deg, #d6d3d1 0%, #a8a29e 100%)',
  },
];

const islandGroups = ['ALL', 'Luzon', 'Visayas', 'Mindanao'];

const regionFilters = [
  'ALL',
  'Bicol Region',
  'Cagayan Valley',
  'Calabarzon',
  'Central Luzon',
  'Central Visayas',
  'Cordillera Administrative Region',
  'Davao Region',
  'Eastern Visayas',
  'Ilocos Region',
  'Iloilo',
  'Northern Mindanao',
  'Pampanga',
  'Western Visayas',
  'Zamboanga Peninsula',
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIsland, setActiveIsland] = useState('ALL');
  const [activeRegion, setActiveRegion] = useState('ALL');
  const [sortValue, setSortValue] = useState('featured');
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    let items = productCatalog.filter((product) => {
      const matchesIsland = activeIsland === 'ALL' || product.island === activeIsland;
      const matchesRegion = activeRegion === 'ALL' || product.region === activeRegion;
      const haystack = `${product.name} ${product.region} ${product.origin}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search);

      return matchesIsland && matchesRegion && matchesSearch;
    });

    switch (sortValue) {
      case 'price-low':
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items = [...items].sort((a, b) => b.rating - a.rating);
        break;
      default:
        items = [...items].sort((a, b) => Number(b.rating) - Number(a.rating));
    }

    return items;
  }, [searchTerm, activeIsland, activeRegion, sortValue]);

  const cartCount = cartItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (product) => {
    setCartItems((current) => [...current, product]);
    setCartOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActiveIsland('ALL');
    setActiveRegion('ALL');
    setSortValue('featured');
  };

  return (
    <div className="page-shell">
      <div className="promo-bar">
        <div className="promo-inner">
          <span className="promo-pill">
            <i className="fa-solid fa-shield-halved" /> MSME ESCROW SECURED
          </span>
          <span className="promo-copy">Direct from origin makers across 17 Philippine regions.</span>
          <div className="promo-actions">
            <button type="button" className="text-link">System Flowchart Spec</button>
            <span className="divider" />
            <button type="button" className="text-link muted">Track Air/Sea Cargo</button>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <div className="brand" onClick={clearFilters} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && clearFilters()}>
            <div className="brand-mark">
              <i className="fa-solid fa-sun" />
            </div>
            <div>
              <div className="brand-row">
                <span className="brand-name">E-Baligya</span>
                <span className="brand-badge">PH Hub</span>
              </div>
              <small>Philippine Regional Pasalubong & Delicacy Logistics</small>
            </div>
          </div>

          <div className="search-wrap desktop-only">
            <i className="fa-solid fa-magnifying-glass search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hopia, bagnet, pastil, pili nuts, piaya, brands or regions..."
            />
            {searchTerm && (
              <button type="button" className="clear-search" onClick={() => setSearchTerm('')} aria-label="Clear search">
                <i className="fa-solid fa-circle-xmark" />
              </button>
            )}
          </div>

          <div className="top-actions">
            <div className="region-picker">
              <button type="button" className="picker-button">
                <i className="fa-solid fa-map-location-dot" />
                <span>{activeRegion === 'ALL' ? '17 Regions' : activeRegion}</span>
                <i className="fa-solid fa-chevron-down" />
              </button>
            </div>

            <button type="button" className="ghost-button mobile-hidden">
              <i className="fa-solid fa-boxes-packing" /> Track Order
            </button>

            <button type="button" className="login-button">
              <i className="fa-regular fa-circle-user" /> Login / Guest
            </button>

            <button type="button" className="cart-button" onClick={() => setCartOpen((value) => !value)} aria-label="Open cart">
              <i className="fa-solid fa-basket-shopping" />
              <span className="cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>

        <div className="mobile-search mobile-only">
          <div className="search-wrap">
            <i className="fa-solid fa-magnifying-glass search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search delicacies, regions, or makers..."
            />
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="eyebrow">
            <i className="fa-solid fa-truck-plane" /> Multi-Island Express Domestic Air & Sea Cargo Hub
          </div>
          <h1>
            Authentic Philippine <span>Pasalubong</span> Delivered Fresh.
          </h1>
          <p>
            Order signature delicacies straight from accredited local MSMEs in 17 regions. From Good Shepherd Ube Jam and BongBong’s Piaya to Camiguin VjANDEP Pastel, backed by escrow payout protection.
          </p>

          <div className="island-tabs">
            <span className="label">Island Group:</span>
            {islandGroups.map((group) => (
              <button
                key={group}
                type="button"
                className={group === activeIsland ? 'tab active' : 'tab'}
                onClick={() => setActiveIsland(group)}
              >
                {group === 'ALL' ? 'All 17 Regions' : `${group} (${group === 'Luzon' ? 8 : group === 'Visayas' ? 3 : 6})`}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="catalog-shell">
        <div className="catalog-header">
          <div>
            <div className="section-title-row">
              <span className="accent-bar" />
              <h2>{activeRegion === 'ALL' ? 'All Regional Delicacies' : activeRegion}</h2>
              <span className="count-pill">{filteredProducts.length} Items</span>
            </div>
            <p className="section-subtitle">Showing authorized authentic pasalubong packaged fresh at origin hubs across the archipelago.</p>
          </div>

          <div className="controls-row">
            <label htmlFor="sortSelect">Sort By:</label>
            <select id="sortSelect" value={sortValue} onChange={(e) => setSortValue(e.target.value)}>
              <option value="featured">Featured / Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            {(searchTerm || activeIsland !== 'ALL' || activeRegion !== 'ALL') && (
              <button type="button" className="clear-filters" onClick={clearFilters}>Clear Filters</button>
            )}
          </div>
        </div>

        <div className="region-filter-bar">
          {regionFilters.map((region) => (
            <button
              key={region}
              type="button"
              className={region === activeRegion ? 'region-pill active' : 'region-pill'}
              onClick={() => setActiveRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="image-wrap" style={{ background: product.accent }}>
                  <div className="emoji-art" aria-label={product.name} role="img">
                    <span>{product.image}</span>
                  </div>
                  <span className="badge">{product.badge}</span>
                </div>
                <div className="card-body">
                  <div className="meta-row">
                    <span className="region-name">{product.region}</span>
                    <span className="rating"><i className="fa-solid fa-star" /> {product.rating}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p className="origin">{product.origin}</p>
                  <div className="price-row">
                    <strong>₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    <button type="button" onClick={() => addToCart(product)}>Add to Basket</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><i className="fa-solid fa-magnifying-glass-location" /></div>
            <h3>No regional delicacies found</h3>
            <p>We couldn't find any products matching your active filters or search terms.</p>
            <button type="button" onClick={clearFilters}>Reset & View All 17 Regions</button>
          </div>
        )}
      </main>

      <aside className={cartOpen ? 'cart-panel open' : 'cart-panel'}>
        <div className="cart-header">
          <h3>Basket</h3>
          <button type="button" className="close-cart" onClick={() => setCartOpen(false)}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <i className="fa-solid fa-basket-shopping" />
            <p>Your basket is empty.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item">
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.region}</small>
                  </div>
                  <span>₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>₱{cartTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
              <button type="button" className="checkout-button">Proceed to Checkout</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default App;
