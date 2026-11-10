import React, { useEffect, useMemo, useRef, useState } from 'react';
import { pasalubongItems } from './products.js';

const REGION_GROUPS = [
  {
    name: 'Luzon',
    icon: 'fa-mountain',
    regions: [
      ['NCR', 'Metro Manila'],
      ['CAR', 'Cordillera / Benguet'],
      ['Region I', 'Ilocos Region'],
      ['Region II', 'Cagayan Valley / Batanes'],
      ['Region III', 'Central Luzon / Pampanga'],
      ['Region IV-A', 'CALABARZON'],
      ['Region IV-B', 'MIMAROPA'],
      ['Region V', 'Bicol Region']
    ]
  },
  {
    name: 'Visayas',
    icon: 'fa-water',
    regions: [
      ['Region VI', 'Western Visayas / Iloilo'],
      ['Region VII', 'Central Visayas / Cebu'],
      ['Region VIII', 'Eastern Visayas / Leyte']
    ]
  },
  {
    name: 'Mindanao',
    icon: 'fa-leaf',
    regions: [
      ['Region IX', 'Zamboanga Peninsula'],
      ['Region X', 'Northern Mindanao'],
      ['Region XI', 'Davao Region'],
      ['Region XII', 'SOCCSKSARGEN'],
      ['Region XIII', 'Caraga'],
      ['BARMM', 'Bangsamoro']
    ]
  }
];

const ISLANDS = ['ALL', 'Luzon', 'Visayas', 'Mindanao'];
const FALLBACK_IMAGE = 'https://placehold.co/600x400/0b132b/fbbf24?text=E-Baligya+Pasalubong';
const formatPeso = (amount, decimals = 0) =>
  `₱${Number(amount).toLocaleString('en-PH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;

function Modal({ title, icon, onClose, children, size = 'max-w-xl' }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`my-auto flex max-h-[92vh] w-full ${size} flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl`}
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
            </span>
            <div>
              <h2 className="font-bold text-slate-900">{title}</h2>
              <p className="text-[11px] text-slate-500">E-Baligya · Philippine MSME Pasalubong Hub</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <i className="fa-solid fa-xmark text-lg" aria-hidden="true"></i>
          </button>
        </header>
        <div className="overflow-y-auto p-5">{children}</div>
      </section>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('ALL');
  const [island, setIsland] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [buyerIsland, setBuyerIsland] = useState('Visayas');
  const [modal, setModal] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    isLoggedIn: true,
    name: 'Maria Clara Santos',
    email: 'maria.clara@example.com',
    phone: '+63 917 889 2341'
  });
  const [authTab, setAuthTab] = useState('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [deliveryOutcome, setDeliveryOutcome] = useState('PENDING');
  const [activeOrder, setActiveOrder] = useState({
    orderId: 'EB-2026-7842',
    escrowAmount: 1250
  });
  const [trackInputId, setTrackInputId] = useState('EB-2026-7842');
  const [paymentMethod, setPaymentMethod] = useState('GCash');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);
  const [ratings, setRatings] = useState({ taste: 5, packaging: 5, freshness: 5 });
  const [checkoutAddress, setCheckoutAddress] = useState({
    name: 'Maria Clara Santos',
    phone: '+63 917 889 2341',
    address: 'Unit 402 Solinea Tower, Cebu Business Park, Mabolo',
    city: 'Cebu City',
    province: 'Cebu (Region VII - Central Visayas)'
  });
  const regionMenuRef = useRef(null);
  const toastTimers = useRef(new Set());
  const paymentTimer = useRef(null);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = pasalubongItems.filter((product) => {
      const matchesRegion = region === 'ALL' || product.region.toLowerCase() === region.toLowerCase();
      const matchesIsland = island === 'ALL' || product.island.toLowerCase() === island.toLowerCase();
      const searchableText = [product.name, product.maker, product.province, product.region, product.badge]
        .join(' ')
        .toLowerCase();
      return matchesRegion && matchesIsland && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });

    if (sortBy === 'price-low') return filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') return filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') return filtered.sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [query, region, island, sortBy]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length === 0 ? 0 : cart.some((item) => item.island !== buyerIsland) ? 260 : 120;
  const total = subtotal + shipping;
  const shelfTitle = region !== 'ALL'
    ? `${region} Pasalubong`
    : island !== 'ALL'
      ? `${island} Pasalubong`
      : 'All Pasalubong';
  const shelfSubtitle = region !== 'ALL'
    ? `Authorized local specialty pasalubong sourced directly from registered ${region} MSMEs.`
    : island !== 'ALL'
      ? `Explore all regional hubs situated in the ${island} island archipelago.`
      : 'Showing authorized authentic pasalubong packaged fresh at origin hubs across the archipelago.';

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (regionMenuRef.current && !regionMenuRef.current.contains(event.target)) setRegionMenuOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModal('');
        setCartOpen(false);
        setRegionMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      toastTimers.current.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(paymentTimer.current);
    };
  }, []);

  const notify = (message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, type }]);
    const timer = window.setTimeout(() => {
      setToasts((items) => items.filter((toast) => toast.id !== id));
      toastTimers.current.delete(timer);
    }, 3500);
    toastTimers.current.add(timer);
  };

  const resetFilters = () => {
    setQuery('');
    setRegion('ALL');
    setIsland('ALL');
    setSortBy('featured');
    setRegionMenuOpen(false);
  };

  const chooseRegion = (nextRegion) => {
    setRegion(nextRegion);
    setIsland('ALL');
    setRegionMenuOpen(false);
  };

  const chooseIsland = (nextIsland) => {
    setIsland(nextIsland);
    setRegion('ALL');
  };

  const addToCart = (product) => {
    if (product.stock <= 0) {
      setSelectedProduct(product);
      setModal('out-of-stock');
      return;
    }
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      return existing
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, quantity: 1 }];
    });
    notify(`Added ${product.name} to basket!`);
  };

  const changeQuantity = (productId, delta) => {
    setCart((items) => items
      .map((item) => item.id === productId ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      notify('Your basket is empty!', 'warning');
      return;
    }
    setCartOpen(false);
    setCheckoutError(false);
    setModal('checkout');
  };

  const executePayment = (event) => {
    event.preventDefault();
    if (paymentLoading) return;
    setPaymentLoading(true);
    setCheckoutError(false);
    paymentTimer.current = window.setTimeout(() => {
      setPaymentLoading(false);
      if (simulateFailure) {
        setCheckoutError(true);
        notify('Payment processing failed. Please retry or select another method.', 'error');
        return;
      }
      const orderId = `EB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setActiveOrder({ orderId, escrowAmount: subtotal });
      setTrackInputId(orderId);
      setDeliveryOutcome('PENDING');
      setCart([]);
      setModal('tracking');
      notify(`Order confirmed! Maker alerted & assigned: ${orderId}`, 'success');
    }, 900);
  };

  const performTrackingLookup = (event) => {
    event.preventDefault();
    const id = trackInputId.trim();
    if (!id) {
      notify('Please enter an Order ID', 'warning');
      return;
    }
    setActiveOrder((order) => ({ ...order, orderId: id }));
    notify(`Loaded consignment details for ${id}`);
  };

  const simulateOutcome = (outcome) => {
    setDeliveryOutcome(outcome);
    notify(
      outcome === 'DELIVERED'
        ? 'Consignment marked as delivered! Escrow released to regional maker.'
        : 'Consignment rescheduled for re-attempt.',
      outcome === 'DELIVERED' ? 'success' : 'warning'
    );
  };

  const submitAuth = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    const name = authTab === 'register'
      ? String(formData.get('name') || '').trim()
      : currentUser.name;
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();

    if (authTab === 'register' && password !== formData.get('confirmPassword')) {
      notify('Passwords do not match.', 'error');
      return;
    }

    setCurrentUser({ isLoggedIn: true, name, email, phone });
    setModal('');
    notify(authTab === 'login' ? `Logged in as ${name}` : `Welcome to E-Baligya, ${name}!`, 'success');
  };

  const submitPasswordReset = (event) => {
    event.preventDefault();
    setResetMessage("Password reset isn't connected to a backend yet. No reset email has been sent.");
  };

  const submitReview = (event) => {
    event.preventDefault();
    setModal('');
    notify('Thank you! Pasalubong quality review sent to the MSME producer.', 'success');
  };

  const addAlternate = () => {
    if (!selectedProduct) return;
    const alternate = pasalubongItems.find((item) => item.id === selectedProduct.alternateId)
      || pasalubongItems.find((item) => item.island === selectedProduct.island && item.stock > 0);
    if (alternate) {
      setModal('');
      addToCart(alternate);
      notify(`Added recommended pasalubong: ${alternate.name}`, 'success');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] font-sans text-slate-800 antialiased">
      <div className="border-b border-slate-800 bg-brand-navy px-4 py-2 text-xs text-amber-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-gold">
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i> MSME ESCROW SECURED
            </span>
            <span className="hidden text-slate-300 sm:inline">Direct from origin makers across 17 Philippine regions. Certified authentic pasalubong cargo.</span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setModal('flowchart')} className="flex items-center gap-1.5 font-medium text-brand-gold transition hover:text-white">
              <i className="fa-solid fa-diagram-project" aria-hidden="true"></i> System Flowchart Spec
            </button>
            <span className="text-slate-600">|</span>
            <button type="button" onClick={() => setModal('tracking')} className="flex items-center gap-1.5 text-slate-300 transition hover:text-white">
              <i className="fa-solid fa-plane-departure text-amber-400" aria-hidden="true"></i> Track Air/Sea Cargo
            </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={resetFilters} className="flex shrink-0 items-center gap-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-navy via-brand-navyLight to-amber-600 text-brand-gold shadow-md">
              <i className="fa-solid fa-sun text-xl" aria-hidden="true"></i>
            </span>
            <span>
              <span className="flex items-center gap-2">
                <span className="font-serif text-2xl font-black tracking-tight text-brand-navy">E-Baligya</span>
                <span className="rounded border border-amber-300 bg-brand-amberLight px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-amber-900">PH Hub</span>
              </span>
              <span className="hidden text-[11px] font-medium tracking-wide text-slate-500 sm:block">Philippine Regional Pasalubong</span>
            </span>
          </button>

          <div className="relative hidden max-w-lg flex-1 md:block">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400" aria-hidden="true"></i>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pasalubong, makers, or regions..."
              aria-label="Search pasalubong"
              className="w-full rounded-xl border border-slate-200 bg-slate-100/90 py-2.5 pl-10 pr-10 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700">
                <i className="fa-solid fa-circle-xmark" aria-hidden="true"></i>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative" ref={regionMenuRef}>
              <button type="button" onClick={() => setRegionMenuOpen((open) => !open)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-amber-400">
                <i className="fa-solid fa-map-location-dot text-brand-gold" aria-hidden="true"></i>
                <span className="hidden sm:inline">{region === 'ALL' ? '17 Regions' : region}</span>
                <i className="fa-solid fa-chevron-down text-xs text-slate-400" aria-hidden="true"></i>
              </button>
              {regionMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 max-h-[80vh] w-[min(90vw,720px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-6">
                  <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Explore Philippine Administrative Regions</h3>
                      <p className="text-xs text-slate-500">Choose a region to view its local MSME shelves.</p>
                    </div>
                    <button type="button" onClick={() => chooseRegion('ALL')} className="text-xs font-semibold text-amber-700 underline">Show all</button>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    {REGION_GROUPS.map((group) => (
                      <section key={group.name}>
                        <h4 className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase text-slate-700">
                          <i className={`fa-solid ${group.icon} text-amber-600`} aria-hidden="true"></i>
                          {group.name} ({group.regions.length})
                        </h4>
                        <div className="space-y-1">
                          {group.regions.map(([code, description]) => (
                            <button key={code} type="button" onClick={() => chooseRegion(code)} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs font-medium text-slate-700 hover:bg-amber-50">
                              <span>{code}<span className="block text-[10px] text-slate-400">{description}</span></span>
                              <i className="fa-solid fa-chevron-right text-[10px] text-slate-300" aria-hidden="true"></i>
                            </button>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button type="button" onClick={() => setModal('tracking')} className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-amber-400 md:flex">
              <i className="fa-solid fa-box-open text-amber-500" aria-hidden="true"></i><span>Track</span>
            </button>
            <button type="button" onClick={() => setModal('auth')} className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-amber-400 sm:flex">
              <i className="fa-solid fa-user text-amber-500" aria-hidden="true"></i><span>{currentUser.isLoggedIn ? currentUser.name.split(' ')[0] : 'Account'}</span>
            </button>
            <button type="button" onClick={() => setCartOpen(true)} aria-label={`Open basket, ${itemCount} items`} className="relative flex items-center gap-2 rounded-xl bg-brand-navy px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navyLight">
              <i className="fa-solid fa-basket-shopping text-brand-gold" aria-hidden="true"></i>
              <span className="hidden sm:inline">Basket</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-black text-brand-navy">{itemCount}</span>
            </button>
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pasalubong, makers, or regions..." aria-label="Search pasalubong" className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold" />
        </div>
      </header>

      <section className="banig-pattern relative overflow-hidden border-b border-slate-800 py-10 text-white sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              <i className="fa-solid fa-sun" aria-hidden="true"></i> From our regions, to your home
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-5xl">Discover the flavors of the Philippines.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">Shop authentic regional pasalubong, directly from local makers and small businesses across the archipelago.</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-400">Island group:</span>
              {ISLANDS.map((name) => {
                const active = island === name;
                const label = name === 'ALL' ? 'All 17 Regions' : `${name}${name === 'Luzon' ? ' (8)' : name === 'Visayas' ? ' (3)' : ' (6)'}`;
                return (
                  <button key={name} type="button" onClick={() => chooseIsland(name)} className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${active ? 'bg-brand-gold text-brand-navy shadow-sm' : 'border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white'}`}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-brand-navy sm:text-2xl">{shelfTitle}</h2>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">{filteredProducts.length} Items</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{shelfSubtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="sortSelect" className="text-xs font-medium text-slate-500">Sort by:</label>
            <select id="sortSelect" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-gold">
              <option value="featured">Featured / Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            {(region !== 'ALL' || island !== 'ALL' || query) && <button type="button" onClick={resetFilters} className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100">Clear filters</button>}
          </div>
        </div>

        {filteredProducts.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article key={product.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img src={product.image} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <span className="absolute left-3 top-3 rounded-full border border-amber-400/20 bg-brand-navy/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-300">{product.region} · {product.island}</span>
                  <span className={`absolute right-3 top-3 rounded px-2 py-0.5 text-[10px] font-semibold text-white shadow ${product.stock <= 0 ? 'bg-red-600' : 'bg-emerald-600/95'}`}>{product.stock <= 0 ? 'Out of Stock' : 'Available'}</span>
                  <div className="absolute bottom-2 left-3 right-3 text-xs text-white">
                    <span className="flex items-center gap-1 truncate text-[10px] text-slate-300"><i className="fa-solid fa-location-dot text-amber-400" aria-hidden="true"></i>{product.province}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    {product.reviewCount > 0 && (
                      <div className="mb-1.5 flex items-center justify-end text-xs">
                        <span className="flex shrink-0 items-center gap-1 font-bold text-amber-500"><i className="fa-solid fa-star" aria-hidden="true"></i>{product.rating.toFixed(1)}<span className="text-[10px] font-normal text-slate-400">({product.reviewCount})</span></span>
                      </div>
                    )}
                    <h3 className="text-sm font-bold leading-snug text-slate-900 transition group-hover:text-amber-600">{product.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{product.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div><strong className="text-base font-black text-brand-navy">{formatPeso(product.price)}</strong></div>
                    <button type="button" onClick={() => addToCart(product)} className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${product.stock <= 0 ? 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : 'bg-brand-navy text-white shadow-md hover:bg-brand-navyLight'}`}>
                      <i className={`fa-solid ${product.stock <= 0 ? 'fa-circle-exclamation' : 'fa-plus text-brand-gold'}`} aria-hidden="true"></i>
                      {product.stock <= 0 ? 'View Alternate' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="my-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-600"><i className="fa-solid fa-magnifying-glass-location" aria-hidden="true"></i></span>
            <h3 className="text-lg font-bold text-slate-800">No pasalubong found</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">We couldn't find any products matching your active filters or search terms.</p>
            <button type="button" onClick={resetFilters} className="mt-4 rounded-xl bg-brand-navy px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-navyLight">Reset &amp; view all regions</button>
          </div>
        )}
      </main>

      <footer className="mt-8 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© 2026 E-Baligya · Supporting Filipino regional makers and MSMEs.</span>
          <div className="flex flex-wrap gap-4">
            <button type="button" onClick={() => setModal('flowchart')} className="hover:text-brand-navy">How escrow works</button>
            <button type="button" onClick={() => setModal('tracking')} className="hover:text-brand-navy">Track an order</button>
            <button type="button" onClick={() => setModal('auth')} className="hover:text-brand-navy">Account</button>
          </div>
        </div>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[1px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <aside role="dialog" aria-modal="true" aria-label="Shopping basket" className="ml-auto flex h-full w-full max-w-[460px] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navy text-brand-gold"><i className="fa-solid fa-basket-shopping" aria-hidden="true"></i></span>
                <div><h2 className="font-bold text-slate-900">Your Pasalubong Basket</h2><p className="text-xs text-slate-500">{itemCount} items from origin hubs</p></div>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Close basket" className="rounded-lg p-2 text-slate-400 hover:bg-slate-200"><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <i className="fa-solid fa-basket-shopping mb-4 text-4xl text-slate-300" aria-hidden="true"></i>
                  <h3 className="font-bold text-slate-800">Your basket is empty</h3>
                  <p className="mt-1 text-xs text-slate-500">Discover a regional favorite and add it to your basket.</p>
                  <button type="button" onClick={() => setCartOpen(false)} className="mt-4 rounded-xl bg-brand-navy px-5 py-2.5 text-xs font-bold text-white">Continue browsing</button>
                </div>
              ) : cart.map((item) => (
                <div key={item.id} className="flex items-start gap-3 border-b border-slate-100 pb-4">
                  <img src={item.image} alt="" className="h-16 w-16 rounded-xl border border-slate-200 object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-bold text-slate-900">{item.name}</h3>
                    <p className="mt-0.5 text-[10px] text-slate-500">Origin: <strong>{item.region}</strong> ({item.island})</p>
                    <p className="mt-1 text-xs font-extrabold text-amber-700">{formatPeso(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                    <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`} className="flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-white">−</button>
                    <span className="px-1 text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Add one ${item.name}`} className="flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-white">+</button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="space-y-4 border-t border-slate-200 bg-slate-50 p-5">
                <label className="block text-xs font-semibold text-slate-700">Deliver to island group
                  <select value={buyerIsland} onChange={(event) => setBuyerIsland(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
                    {['Luzon', 'Visayas', 'Mindanao'].map((name) => <option key={name}>{name}</option>)}
                  </select>
                </label>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><i className={`fa-solid ${shipping > 120 ? 'fa-plane-departure text-amber-500' : 'fa-truck-fast text-emerald-500'}`} aria-hidden="true"></i>{shipping > 120 ? 'Domestic air/sea cargo freight' : 'Intra-island ground express'}</span>
                  <strong className="text-slate-800">{formatPeso(shipping, 2)}</strong>
                </div>
                <div className="space-y-1.5 border-t border-slate-200 pt-3 text-xs text-slate-600">
                  <div className="flex justify-between"><span>Pasalubong subtotal</span><strong className="text-slate-900">{formatPeso(subtotal, 2)}</strong></div>
                  <div className="flex justify-between"><span>Calculated origin freight</span><strong className="text-slate-900">{formatPeso(shipping, 2)}</strong></div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-brand-navy"><span>Estimated total</span><strong className="text-amber-600">{formatPeso(total, 2)}</strong></div>
                </div>
                <button type="button" onClick={openCheckout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-navyLight">
                  Proceed to Checkout <i className="fa-solid fa-arrow-right text-xs text-brand-gold" aria-hidden="true"></i>
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {modal === 'out-of-stock' && selectedProduct && (
        <Modal title="Pasalubong out of stock" icon="fa-boxes-stacked" onClose={() => setModal('')} size="max-w-md">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">{selectedProduct.name} is currently out of stock.</p>
            <p className="mt-1 text-xs text-slate-500">Our regional MSME maker is preparing the next fresh batch.</p>
          </div>
          {(() => {
            const alternate = pasalubongItems.find((item) => item.id === selectedProduct.alternateId)
              || pasalubongItems.find((item) => item.island === selectedProduct.island && item.stock > 0);
            return alternate ? (
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <img src={alternate.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1"><strong className="block truncate text-xs text-slate-900">{alternate.name}</strong><span className="text-[11px] text-slate-500">{alternate.region} · {alternate.maker}</span><strong className="block text-xs text-amber-700">{formatPeso(alternate.price)}</strong></div>
                <button type="button" onClick={addAlternate} className="rounded-lg bg-brand-gold px-3 py-2 text-[11px] font-bold text-brand-navy">Add</button>
              </div>
            ) : <p className="mt-4 text-center text-xs text-slate-500">No in-stock alternative is available right now.</p>;
          })()}
        </Modal>
      )}

      {modal === 'checkout' && (
        <Modal title="Checkout order" icon="fa-cash-register" onClose={() => setModal('')}>
          <form onSubmit={executePayment} className="space-y-5">
            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-800"><i className="fa-solid fa-location-dot mr-1.5 text-amber-500" aria-hidden="true"></i>Philippine delivery address</h3>
              <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 sm:grid-cols-2">
                {[
                  ['name', 'Full name'],
                  ['phone', 'PH mobile (+63)'],
                  ['address', 'Street / Barangay / Landmark'],
                  ['city', 'City / Municipality'],
                  ['province', 'Destination province & region']
                ].map(([field, label]) => (
                  <label key={field} className={`text-[11px] font-semibold text-slate-600 ${field === 'address' || field === 'province' ? 'sm:col-span-2' : ''}`}>{label}
                    <input required value={checkoutAddress[field]} onChange={(event) => setCheckoutAddress((address) => ({ ...address, [field]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                  </label>
                ))}
              </div>
            </section>
            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-800"><i className="fa-solid fa-credit-card mr-1.5 text-amber-500" aria-hidden="true"></i>Payment processing method</h3>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[
                  ['GCash', 'G', 'E-Wallet', 'bg-blue-600'],
                  ['Maya', 'M', 'Scan QR', 'bg-emerald-600'],
                  ['Card', 'C', 'Debit/Credit', 'bg-slate-800'],
                  ['COD', '₱', 'Doorstep', 'bg-amber-600']
                ].map(([method, symbol, hint, color]) => (
                  <label key={method} className={`flex cursor-pointer flex-col items-center rounded-xl border p-3 text-center transition ${paymentMethod === method ? 'border-brand-gold bg-amber-50/50' : 'border-slate-200 hover:border-amber-400'}`}>
                    <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="sr-only" />
                    <span className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white ${color}`}>{symbol}</span>
                    <strong className="text-xs text-slate-800">{method}</strong><span className="text-[10px] text-slate-400">{hint}</span>
                  </label>
                ))}
              </div>
            </section>
            <div className="rounded-xl border border-slate-200 p-3 text-xs">
              <div className="flex justify-between text-slate-600"><span>Pasalubong subtotal</span><span>{formatPeso(subtotal, 2)}</span></div>
              <div className="mt-1 flex justify-between text-slate-600"><span>Origin freight</span><span>{formatPeso(shipping, 2)}</span></div>
              <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 font-bold text-brand-navy"><span>Total</span><span>{formatPeso(total, 2)}</span></div>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-500"><input type="checkbox" checked={simulateFailure} onChange={(event) => setSimulateFailure(event.target.checked)} className="accent-amber-500" />Simulate payment failure (testing)</label>
            {checkoutError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">Payment authorization failed. Your basket is unchanged. Retry or select another payment method.</p>}
            <div className="flex gap-3 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => setModal('')} className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={paymentLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-3 text-xs font-bold text-white transition hover:bg-brand-navyLight disabled:opacity-60">
                {paymentLoading ? <><i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Authorizing...</> : <><i className="fa-solid fa-lock text-brand-gold" aria-hidden="true"></i> Authorize &amp; place order</>}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'tracking' && (
        <Modal title="Track air / sea cargo" icon="fa-plane-departure" onClose={() => setModal('')} size="max-w-2xl">
          <form onSubmit={performTrackingLookup} className="mb-5 grid gap-2 sm:grid-cols-[1fr_auto]">
            <label className="text-[10px] font-bold uppercase text-slate-500">Order ID
              <input value={trackInputId} onChange={(event) => setTrackInputId(event.target.value)} placeholder="e.g. EB-2026-7842" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal normal-case text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-gold" />
            </label>
            <button type="submit" className="self-end rounded-lg bg-brand-navy px-4 py-2 text-xs font-bold text-white hover:bg-brand-navyLight">Track order</button>
          </form>
          <div className="flex flex-col justify-between gap-3 rounded-xl bg-gradient-to-r from-brand-navy to-brand-navyLight p-4 text-white sm:flex-row sm:items-center">
            <div><span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Active consignment</span><h3 className="font-mono text-xl font-bold">{activeOrder.orderId}</h3><span className="text-xs text-slate-300">Routed via Philippine domestic air/sea cargo</span></div>
            <div className="rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 text-right"><span className="block text-[10px] font-bold uppercase text-amber-300">Escrow status</span><strong className="text-xs">{deliveryOutcome === 'DELIVERED' ? `Payout released (${formatPeso(activeOrder.escrowAmount, 2)})` : deliveryOutcome === 'FAILED' ? `Escrow paused (${formatPeso(activeOrder.escrowAmount, 2)})` : `Held in escrow (${formatPeso(activeOrder.escrowAmount, 2)})`}</strong><span className="block text-[9px] text-slate-300">Released to maker upon verified delivery</span></div>
          </div>
          <section className="mt-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-700"><i className="fa-solid fa-truck-ramp-box mr-1.5 text-amber-500" aria-hidden="true"></i>Logistics tracking lifecycle</h3>
            <ol className="ml-3 space-y-5 border-l-2 border-slate-200 pl-6 text-xs">
              {[
                ['Origin hub: regional MSME dispatched', 'Producer packed authentic pasalubong at the regional hub.', 'fa-box'],
                ['Inter-island transit: domestic air / sea freight', 'Cargo departed the regional sorting hub.', 'fa-plane'],
                ['Last-mile courier at buyer address', deliveryOutcome === 'FAILED' ? 'Delivery rescheduled for a second attempt.' : 'Assigned to a local courier for final delivery.', 'fa-motorcycle'],
                [deliveryOutcome === 'DELIVERED' ? 'Order delivered & completed' : deliveryOutcome === 'FAILED' ? 'Delivery rescheduled (re-attempt)' : 'Delivery outcome & customer receipt', deliveryOutcome === 'DELIVERED' ? 'Receipt verified. Escrow released to the regional maker.' : deliveryOutcome === 'FAILED' ? 'Courier will attempt doorstep delivery again.' : 'Awaiting doorstep handover and recipient confirmation.', 'fa-box-open']
              ].map(([title, description, icon], index) => {
                const complete = index < 2 || (deliveryOutcome === 'DELIVERED' && index >= 2);
                return <li key={title} className="relative">
                  <span className={`absolute -left-[34px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-[10px] ring-4 ring-white ${complete ? 'bg-emerald-500 text-white' : index === 2 && deliveryOutcome === 'FAILED' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}><i className={`fa-solid ${complete ? 'fa-check' : icon}`} aria-hidden="true"></i></span>
                  <strong className="text-slate-900">{title}</strong><p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
                </li>;
              })}
            </ol>
          </section>
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-800"><i className="fa-solid fa-sliders text-amber-500" aria-hidden="true"></i>Simulate delivery outcome</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => simulateOutcome('DELIVERED')} className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"><i className="fa-solid fa-circle-check" aria-hidden="true"></i>Customer confirms receipt</button>
              <button type="button" onClick={() => simulateOutcome('FAILED')} className="flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700"><i className="fa-solid fa-calendar-xmark" aria-hidden="true"></i>Delivery rescheduled</button>
            </div>
          </div>
          {deliveryOutcome === 'DELIVERED' && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <strong className="text-xs text-emerald-900"><i className="fa-solid fa-certificate mr-1.5 text-emerald-600" aria-hidden="true"></i>Order delivered! Escrow payout released.</strong>
            <p className="mt-1 text-[11px] text-emerald-700">Receipt verified and funds released directly to the regional producer.</p>
            <button type="button" onClick={() => setModal('review')} className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"><i className="fa-solid fa-star mr-1.5 text-amber-300" aria-hidden="true"></i>Rate &amp; review pasalubong</button>
          </div>}
          {deliveryOutcome === 'FAILED' && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">The courier could not complete delivery. Escrow remains secure while a new delivery attempt is arranged.</p>}
        </Modal>
      )}

      {modal === 'review' && (
        <Modal title="Rate & review pasalubong" icon="fa-star" onClose={() => setModal('')} size="max-w-md">
          <form onSubmit={submitReview} className="space-y-5">
            <p className="text-xs text-slate-500">Your feedback helps the local maker improve quality and freshness.</p>
            {Object.entries({ taste: 'Taste', packaging: 'Packaging', freshness: 'Freshness' }).map(([metric, label]) => (
              <fieldset key={metric}>
                <legend className="text-xs font-bold text-slate-700">{label} <span className="font-normal text-slate-400">· {ratings[metric]} / 5</span></legend>
                <div className="mt-1 flex gap-1">
                  {[1, 2, 3, 4, 5].map((score) => <button key={score} type="button" onClick={() => setRatings((current) => ({ ...current, [metric]: score }))} aria-label={`${score} stars for ${label}`} className={`text-xl ${score <= ratings[metric] ? 'text-amber-400' : 'text-slate-300'}`}><i className={`fa-${score <= ratings[metric] ? 'solid' : 'regular'} fa-star`} aria-hidden="true"></i></button>)}
                </div>
              </fieldset>
            ))}
            <label className="block text-xs font-semibold text-slate-700">Review (optional)<textarea rows="3" placeholder="Share your experience..." className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-gold"></textarea></label>
            <button type="submit" className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white hover:bg-emerald-700">Submit review</button>
          </form>
        </Modal>
      )}

      {modal === 'auth' && (
        <Modal title={authTab === 'forgot' ? 'Reset your password' : 'Your account'} icon="fa-user" onClose={() => setModal('')} size="max-w-md">
          {authTab !== 'forgot' ? (
            <div className="mb-4 flex rounded-xl bg-slate-100 p-1">
              {['login', 'register'].map((tab) => <button key={tab} type="button" onClick={() => setAuthTab(tab)} className={`flex-1 rounded-lg py-2 text-xs font-semibold capitalize ${authTab === tab ? 'bg-white text-brand-navy shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{tab === 'login' ? 'Log in' : 'Create account'}</button>)}
            </div>
          ) : (
            <button type="button" onClick={() => { setAuthTab('login'); setResetMessage(''); }} className="mb-4 text-xs font-semibold text-amber-700 hover:text-amber-800">
              <i className="fa-solid fa-arrow-left mr-1" aria-hidden="true"></i>Back to log in
            </button>
          )}

          {authTab === 'forgot' ? (
            <form key="forgot-password" onSubmit={submitPasswordReset} className="space-y-3">
              <p className="text-xs leading-relaxed text-slate-500">Enter the email address associated with your account to request a password reset.</p>
              <label className="block text-xs font-semibold text-slate-600">Email address
                <input required name="resetEmail" type="email" autoComplete="email" value={resetEmail} onChange={(event) => { setResetEmail(event.target.value); setResetMessage(''); }} placeholder="you@example.com" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-gold" />
              </label>
              {resetMessage && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">{resetMessage}</p>}
              <button type="submit" className="w-full rounded-xl bg-brand-navy px-4 py-3 text-xs font-bold text-white hover:bg-brand-navyLight">Request password reset</button>
            </form>
          ) : (
            <form key={authTab} onSubmit={submitAuth} className="space-y-3">
              {authTab === 'register' && (
                <>
                  <label className="block text-xs font-semibold text-slate-600">Full name
                    <input required name="name" autoComplete="name" placeholder="Your full name" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                  </label>
                  <label className="block text-xs font-semibold text-slate-600">Phone number
                    <input required name="phone" type="tel" autoComplete="tel" placeholder="+63 917 123 4567" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                  </label>
                </>
              )}
              <label className="block text-xs font-semibold text-slate-600">Email address
                <input required name="email" type="email" autoComplete="email" defaultValue={authTab === 'login' ? currentUser.email || '' : ''} placeholder="you@example.com" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-gold" />
              </label>
              <label className="block text-xs font-semibold text-slate-600">Password
                <input required name="password" type="password" autoComplete={authTab === 'login' ? 'current-password' : 'new-password'} minLength={8} placeholder={authTab === 'login' ? 'Enter your password' : 'At least 8 characters'} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-gold" />
              </label>
              {authTab === 'login' ? (
                <div className="text-right">
                  <button type="button" onClick={() => { setAuthTab('forgot'); setResetEmail(''); setResetMessage(''); }} className="text-xs font-semibold text-amber-700 hover:text-amber-800">Forgot password?</button>
                </div>
              ) : (
                <label className="block text-xs font-semibold text-slate-600">Confirm password
                  <input required name="confirmPassword" type="password" autoComplete="new-password" minLength={8} placeholder="Re-enter your password" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal focus:outline-none focus:ring-1 focus:ring-brand-gold" />
                </label>
              )}
              <button type="submit" className="w-full rounded-xl bg-brand-navy px-4 py-3 text-xs font-bold text-white hover:bg-brand-navyLight">{authTab === 'login' ? 'Log in' : 'Create account'}</button>
              {currentUser.isLoggedIn && <p className="text-center text-[11px] text-slate-500">Signed in as {currentUser.name}</p>}
              <p className="text-center text-[10px] text-slate-400">Demo form only — account credentials are not sent to a server.</p>
            </form>
          )}
        </Modal>
      )}

      {modal === 'flowchart' && (
        <Modal title="System flowchart specification" icon="fa-diagram-project" onClose={() => setModal('')} size="max-w-2xl">
          <p className="text-sm leading-relaxed text-slate-600">Orders are routed from regional MSME makers to customers with funds held in escrow until delivery is confirmed.</p>
          <ol className="mt-5 space-y-3">
            {[
              ['Browse regional shelves', 'Filter by island group or region, search products, and compare prices and ratings.'],
              ['Check stock & basket', 'Available items can be added to the basket. Out-of-stock items show an in-stock regional alternative.'],
              ['Checkout & escrow', 'Choose a Philippine payment method and confirm the delivery address. Payment is securely held in escrow.'],
              ['Origin dispatch & cargo', 'The maker prepares the order and routes it via ground courier or domestic air/sea cargo.'],
              ['Delivery outcome', 'Successful buyer confirmation releases escrow to the maker. Failed delivery keeps funds secure for a re-attempt.'],
              ['Review', 'After confirmed delivery, buyers can rate taste, packaging, and freshness.']
            ].map(([title, text], index) => <li key={title} className="flex gap-3 rounded-xl border border-slate-200 p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-brand-gold">{index + 1}</span><div><h3 className="text-xs font-bold text-slate-900">{title}</h3><p className="mt-0.5 text-xs text-slate-500">{text}</p></div></li>)}
          </ol>
        </Modal>
      )}

      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(90vw,24rem)] flex-col gap-2">
        {toasts.map((toast) => {
          const colors = {
            info: 'border-blue-200',
            success: 'border-emerald-200',
            warning: 'border-amber-200',
            error: 'border-rose-200'
          };
          const icons = {
            info: 'fa-circle-info text-blue-500',
            success: 'fa-circle-check text-emerald-500',
            warning: 'fa-triangle-exclamation text-amber-500',
            error: 'fa-circle-xmark text-rose-500'
          };
          return <div key={toast.id} className={`flex items-center gap-2.5 rounded-xl border bg-white px-4 py-3 text-xs text-slate-800 shadow-xl ${colors[toast.type]}`}>
            <i className={`fa-solid ${icons[toast.type]}`} aria-hidden="true"></i><span className="font-medium">{toast.message}</span>
          </div>;
        })}
      </div>
    </div>
  );
}

export default App;
