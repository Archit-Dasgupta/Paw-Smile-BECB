const { useState, useMemo, useEffect } = React;

/* Buttons */
const PrimaryBtn = ({ children, onClick, className = "", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={
      "inline-flex items-center justify-center rounded-xl px-3 py-2 sm:px-4 sm:py-2 font-medium text-white bg-[var(--accent)] " +
      "hover:opacity-90 transition disabled:opacity-50 " + className
    }
  >
    {children}
  </button>
);
const OutlineBtn = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={
      "inline-flex items-center justify-center rounded-xl px-3 py-2 sm:px-4 sm:py-2 font-medium border border-[var(--primary)] " +
      "text-[var(--primary)] bg-white hover:bg-[var(--bg)] transition " + className
    }
  >
    {children}
  </button>
);

const formatINR = (n) => "₹" + Number(n).toFixed(0);
const pctOff = (price, compareAt) => Math.round(((compareAt - price) / compareAt) * 100);

const CATALOG = [
  { id: 1, name: "Complete Dental Care Kit", price: 499, compareAt: 699, stock: 7,  image: "https://placedog.net/600/420?id=201", badge: "Best Seller" },
  { id: 2, name: "Puppy Gentle Brush + Gel", price: 399, compareAt: 549, stock: 12, image: "https://placedog.net/600/420?id=202", badge: "New" },
  { id: 3, name: "Advanced Plaque Remover",  price: 599, compareAt: 799, stock: 5,  image: "https://placedog.net/600/420?id=203", badge: "Limited" },
];

function App() {
  const [page, setPage] = useState("landing");
  const [cart, setCart] = useState([]);
  const [activeId, setActiveId] = useState(CATALOG[0].id);

  const [countdownSeconds, setCountdownSeconds] = useState(2 * 60 * 60);
  useEffect(() => {
    const t = setInterval(() => setCountdownSeconds(s => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const timeLeft = useMemo(() => {
    const h = String(Math.floor(countdownSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((countdownSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(countdownSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [countdownSeconds]);

  const [coupon, setCoupon] = useState("SMILE15");
  const [couponApplied, setCouponApplied] = useState(false);
  const FREE_SHIPPING_AT = 999;

  const cartCount = useMemo(() => cart.reduce((sum, l) => sum + l.qty, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((sum, l) => {
    const p = CATALOG.find(x => x.id === l.id);
    return sum + (p ? p.price * l.qty : 0);
  }, 0), [cart]);
  const discountValue = useMemo(() => couponApplied ? Math.round(cartSubtotal * 0.15) : 0, [cartSubtotal, couponApplied]);
  const cartTotal = Math.max(cartSubtotal - discountValue, 0);
  const freeShipGap = Math.max(FREE_SHIPPING_AT - cartTotal, 0);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const addToCart = (id, qty = 1) => {
    setCart(prev => {
      const line = prev.find(l => l.id === id);
      return line ? prev.map(l => l.id === id ? { ...l, qty: l.qty + qty } : l) : [...prev, { id, qty }];
    });
  };
  const updateQty = (id, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(l => l.id !== id));
    else setCart(prev => prev.map(l => l.id === id ? { ...l, qty } : l));
  };

  const activeProduct = CATALOG.find(p => p.id === activeId) || CATALOG[0];
  const NavButton = ({ label, goto }) => <button onClick={() => setPage(goto)} className="hover:opacity-90">{label}</button>;

  return (
    <div className="min-h-screen">
      {/* Promo bar */}
      <div className="w-full bg-[var(--dark)] text-white text-center text-xs sm:text-sm py-2 px-3">
        <span className="font-semibold">Flash Sale</span>: 15% off with <span className="font-mono bg-white text-black px-1 rounded">SMILE15</span> — Ends in {timeLeft}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-[var(--primary)] text-white shadow">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight">Paw Smile Dental</h1>

          <nav className="hidden sm:flex items-center gap-4 text-sm md:text-base">
            <NavButton label="Home" goto="landing" />
            <NavButton label="About Us" goto="about" />
            <NavButton label="Shop" goto="shop" />
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setPage("shop")} className="sm:hidden text-sm bg-white/10 px-3 py-1.5 rounded-lg">Shop</button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative rounded-xl bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-white/20 transition text-sm md:text-base"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] sm:text-xs bg-white text-[var(--primary)] font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 inline-flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Cart drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)}></div>
          <aside className="absolute right-0 top-0 h-full w-[96%] xs:w-[92%] sm:w-[420px] bg-white shadow-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-[var(--primary)]">Your Cart</h3>
              <button className="text-gray-500 hover:text-black" onClick={() => setDrawerOpen(false)}>✕</button>
            </div>

            {/* Free shipping nudge */}
            <div className="rounded-xl border p-3 text-xs sm:text-sm">
              {freeShipGap > 0 ? (
                <>
                  <div className="mb-2">Add {formatINR(freeShipGap)} more for <span className="font-semibold">FREE Shipping</span></div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-[var(--accent)] rounded" style={{ width: Math.min((cartTotal / 999) * 100, 100) + "%" }}></div>
                  </div>
                </>
              ) : (
                <div className="text-[var(--accent)] font-medium">🎉 You unlocked FREE shipping!</div>
              )}
            </div>

            <div className="space-y-3 max-h-[45vh] overflow-auto pr-1">
              {cart.length === 0 && <div className="text-sm text-gray-500">Your cart is empty.</div>}
              {cart.map(line => {
                const p = CATALOG.find(x => x.id === line.id);
                if (!p) return null;
                return (
                  <div key={p.id} className="flex items-center gap-3 border rounded-xl p-2">
                    <img src={p.image} alt={p.name} width="64" height="64" loading="lazy" className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">{p.name}</div>
                      <div className="text-xs sm:text-sm">{formatINR(p.price)} ×
                        <input
                          type="number" min="0" value={line.qty}
                          onChange={(e) => updateQty(p.id, parseInt(e.target.value || 0, 10))}
                          className="w-12 sm:w-14 ml-2 border rounded px-1 py-0.5 text-center"
                        />
                      </div>
                    </div>
                    <div className="font-semibold text-sm sm:text-base">{formatINR(p.price * line.qty)}</div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                className="flex-1 border rounded-xl px-3 py-2 text-sm"
                placeholder="Coupon code"
              />
              <PrimaryBtn onClick={() => setCouponApplied(coupon.trim() === "SMILE15")} className="text-sm">Apply</PrimaryBtn>
            </div>
            {couponApplied
              ? <div className="text-sm text-[var(--accent)]">✅ Coupon applied: -{formatINR(discountValue)}</div>
              : <div className="text-sm text-gray-500">Tip: Use <span className="font-mono">SMILE15</span> for 15% off</div>}

            <div className="border rounded-xl p-3 text-sm space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(cartSubtotal)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-{formatINR(discountValue)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>{formatINR(cartTotal)}</span></div>
            </div>

            <div className="flex gap-2">
              <PrimaryBtn onClick={() => { setDrawerOpen(false); if (cart.length) setPage("address"); }} className="flex-1" disabled={cart.length === 0}>Checkout</PrimaryBtn>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="mx-auto max-w-screen-xl px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Landing */}
        {page === "landing" && (
          <div className="space-y-6 sm:space-y-8">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--primary)] leading-tight">
                  Healthy Teeth. Happy Dogs.
                </h2>
                <p className="mt-3 text-base sm:text-lg">
                  Vet-approved dental kits for wag-worthy smiles. Easy. Safe. Loved by pets & parents.
                </p>
                <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 sm:gap-3">
                  <PrimaryBtn onClick={() => setPage("shop")}>Shop Now</PrimaryBtn>
                </div>
                <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-2 bg-[var(--bg)] px-2 sm:px-3 py-1 rounded-full border">⭐ 4.8/5 by 1,200+ pet parents</span>
                  <span className="inline-flex items-center gap-2 bg-[var(--bg)] px-2 sm:px-3 py-1 rounded-full border">✅ Vet Recommended</span>
                  <span className="inline-flex items-center gap-2 bg-[var(--bg)] px-2 sm:px-3 py-1 rounded-full border">🔁 30-day money-back</span>
                </div>
              </div>

              <div className="relative">
                <div className="w-full rounded-2xl overflow-hidden shadow-xl aspect-[16/10]">
                  <img
                    src="https://placedog.net/900/650?id=101"
                    alt="Happy dog hero"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-[var(--accent)] text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg shadow">
                  10,000+ kits sold
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: "Vet Recommended", img: "https://placedog.net/400/300?id=111" },
                { title: "Safe & Natural",   img: "https://placedog.net/400/300?id=112" },
                { title: "Easy to Use",      img: "https://placedog.net/400/300?id=113" },
              ].map(b => (
                <div key={b.title} className="bg-white rounded-2xl shadow p-4">
                  <div className="rounded-xl overflow-hidden aspect-[4/3] mb-3">
                    <img src={b.img} alt={b.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg">{b.title}</h3>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* About */}
        {page === "about" && (
          <section className="bg-white rounded-2xl shadow p-4 sm:p-6">
            <div className="rounded-xl overflow-hidden aspect-[30/9] mb-4">
              <img src="https://placedog.net/1200/380?id=140" alt="About cover" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--primary)] mb-2">Our Story</h2>
            <p className="text-sm sm:text-base">We’re pet parents first. Our mission is to prevent dental disease in dogs with easy-to-use, safe, and effective kits. Every purchase supports dog shelters across India.</p>
          </section>
        )}

        {/* Shop */}
        {page === "shop" && (
          <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {CATALOG.map(p => (
              <div key={p.id} onClick={(e) => { e.stopPropagation(); setActiveId(p.id); setPage("detail"); }} className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 cursor-pointer card elev-1">
                <div className="relative">
                  <div className="rounded-xl overflow-hidden aspect-[4/3] mb-3">
                    <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover product-img" />
                  </div>
                  <span className="absolute top-2 left-2 text-[10px] sm:text-xs bg-[var(--primary)] text-white px-2 py-1 rounded-lg badge badge--primary">{p.badge}</span>
                  <span className="absolute top-2 right-2 text-[10px] sm:text-xs bg-[var(--accent)] text-white px-2 py-1 rounded-lg badge badge--sale">-{pctOff(p.price, p.compareAt)}%</span>
                </div>

                <h3 className="font-semibold leading-tight text-base sm:text-lg clamp-1">{p.name}</h3>
                <div className="text-sm sm:text-base text-gray-600">
                  <span className="font-semibold price-now">{formatINR(p.price)}</span>{" "}
                  <span className="price-was">{formatINR(p.compareAt)}</span>
                </div>
                <div className="text-xs stock-warning mt-1">Only {p.stock} left</div>

                <div className="mt-3 flex gap-2">
                  <PrimaryBtn onClick={(e) => { e.stopPropagation(); addToCart(p.id); }} className="flex-1">Add to Cart</PrimaryBtn>
                </div>
                <PrimaryBtn onClick={(e) => { e.stopPropagation(); addToCart(p.id); setPage("address"); }} className="mt-2 w-full">Buy Now</PrimaryBtn>
              </div>
            ))}
          </section>
        )}

        {/* Product Detail */}
        {page === "detail" && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="rounded-2xl overflow-hidden shadow aspect-[16/10]">
              <img src="https://placedog.net/900/650?id=240" alt={activeProduct.name} loading="lazy" className="w-full h-full object-cover" />
            </div>

            <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--primary)]">{activeProduct.name}</h2>
              <p className="mt-2">
                <span className="font-semibold">{formatINR(activeProduct.price)}</span>
                <span className="line-through text-gray-400 ml-2">{formatINR(activeProduct.compareAt)}</span>
                <span className="ml-2 text-[10px] sm:text-xs bg-[var(--accent)] text-white px-2 py-0.5 rounded">{pctOff(activeProduct.price, activeProduct.compareAt)}% OFF</span>
              </p>
              <p className="mt-3 text-sm sm:text-base">Everything you need to keep your dog’s teeth clean and healthy.</p>

              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                <PrimaryBtn onClick={() => addToCart(activeProduct.id)}>Add to Cart</PrimaryBtn>
                <PrimaryBtn onClick={() => { addToCart(activeProduct.id); setPage("address"); }}>Buy Now</PrimaryBtn>
              </div>

              <div className="mt-6 grid grid-cols-3 text-xs sm:text-sm">
                <div className="border-b-2 border-[var(--primary)] pb-2 font-semibold">Description</div>
                <div className="border-b pb-2 text-gray-500">Ingredients</div>
                <div className="border-b pb-2 text-gray-500">Reviews</div>
              </div>
              <p className="mt-3 text-xs sm:text-sm">Starter kit with brush, gel, and tutorial. Gentle on gums, effective on plaque.</p>
            </div>
          </section>
        )}

        {/* Address */}
        {page === "address" && (
          <section className="max-w-md w-full mx-auto bg-white rounded-2xl shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--primary)]">Delivery Details</h2>
            <div className="text-xs mt-1 text-gray-600">Tip: Add more items and apply SMILE15 at checkout to save more.</div>
            <div className="mt-4 space-y-3">
              <input className="w-full rounded-xl border px-3 py-2 text-sm sm:text-base" placeholder="Full Name" />
              <input className="w-full rounded-xl border px-3 py-2 text-sm sm:text-base" placeholder="Mobile Number" />
              <input className="w-full rounded-xl border px-3 py-2 text-sm sm:text-base" placeholder="Address" />
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-xl border px-3 py-2 text-sm sm:text-base" placeholder="City" />
                <input className="rounded-xl border px-3 py-2 text-sm sm:text-base" placeholder="Pin Code" />
              </div>
              <div className="border rounded-xl p-3 text-sm space-y-1">
                <div className="flex justify-between"><span>Items</span><span>{cartCount}</span></div>
                <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(cartSubtotal)}</span></div>
                <div className="flex justify-between"><span>Discount (if coupon)</span><span>-{formatINR(discountValue)}</span></div>
                <div className="flex justify-between font-semibold"><span>To Pay</span><span>{formatINR(Math.max(cartSubtotal - discountValue,0))}</span></div>
              </div>
              <PrimaryBtn onClick={() => setPage("payment")}>Proceed to Payment</PrimaryBtn>
            </div>
          </section>
        )}

        {/* Payment */}
        {page === "payment" && (
          <section className="max-w-md w-full mx-auto bg-white rounded-2xl shadow p-4 sm:p-6">
            <div className="mb-4 text-xs sm:text-sm"><span className="font-medium">Address</span> → <span className="font-bold text-[var(--primary)]">Payment</span> → <span className="text-gray-400">Thank You</span></div>
            <div className="rounded-xl overflow-hidden aspect-[5/2] mb-3">
              <img src="https://placedog.net/500/200?id=260" alt="Payment visual" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <p className="mb-2">Order Total: <span className="font-semibold">{formatINR(Math.max(cartSubtotal - discountValue,0))}</span></p>
            <p className="mb-4 text-sm text-gray-600">Pay via UPI, Cards, NetBanking, or Cash on Delivery.</p>
            <PrimaryBtn onClick={() => setPage("thankyou")}>Pay Now</PrimaryBtn>
          </section>
        )}

        {/* Thank You */}
        {page === "thankyou" && (
          <section className="text-center bg-white rounded-2xl shadow p-6 sm:p-8 max-w-lg w-full mx-auto">
            <div className="rounded-xl overflow-hidden aspect-[25/17] mb-4">
              <img src="https://placedog.net/500/340?id=280" alt="Thank you dog" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--accent)]">Thank You!</h2>
            <p className="mt-2">Your order has been placed successfully.</p>
            <p className="text-sm mt-2">Estimated delivery: 3–5 days</p>
            <div className="mt-4"><OutlineBtn onClick={() => setPage("landing")}>Back to Home</OutlineBtn></div>
          </section>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
