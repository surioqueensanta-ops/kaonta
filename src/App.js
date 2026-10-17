import React, { useState } from 'react';
import './App.css';
import './Motion.css';
import { initialMenu, sampleAccounts } from './data/restaurantData';
import { today, newId } from './utils/formatters';
import Brand from './components/Brand';
import FixedNavigation from './components/FixedNavigation';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Reservation from './pages/Reservation';
import Checkout from './pages/Checkout';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Reviews from './pages/Reviews';
import FoodDetails from './components/FoodDetails';
import { canReview, validateReviewInput } from './utils/reviewRules';

// App coordinates shared data and navigation. Edit screen layouts in src/pages.
export default function App() {
  const [view, setView] = useState('home');
  const [selectedFood, setSelectedFood] = useState(null);
  const [menu, setMenu] = useState(initialMenu);
  const [category, setCategory] = useState('All dishes');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  // Demo accounts exist only in memory. Never use this approach for production auth.
  const [accounts, setAccounts] = useState(sampleAccounts);
  const [authMode, setAuthMode] = useState('login');
  const [afterLogin, setAfterLogin] = useState('activity');
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notice, setNotice] = useState('');
  const [service, setService] = useState('Delivery');
  const [zone, setZone] = useState('Central zone');
  const [preorder, setPreorder] = useState(false);
  const [adminTab, setAdminTab] = useState('Overview');
  const [visitDate, setVisitDate] = useState(today());
  const [visitTime, setVisitTime] = useState('17:00');
  const cartItems = cart.map(line => ({
    ...menu.find(item => item.id === line.id),
    quantity: line.quantity
  }));
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cartItems.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const deliveryFee = service === 'Delivery' && cart.length ? zone === 'Central zone' ? 50 : 80 : 0;
  const shownMenu = menu.filter(item => (category === 'All dishes' || item.category === category) && item.name.toLowerCase().includes(query.toLowerCase()));
  const slotsLeft = Math.max(0, 5 - bookings.filter(b => b.date === visitDate && b.time === visitTime && !['Cancelled', 'Declined', 'Completed'].includes(b.status)).length);
  function go(next) {
    setNotice('');
    setView(next);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  }
  function requireLogin(next) {
    if (user) return go(next);
    setAfterLogin(next);
    setAuthMode('login');
    go('auth');
    setNotice('Please log in or create a demo account to continue.');
  }
  function add(id, count = 1) {
    if (!menu.find(item => item.id === id)?.available) return false;
    if (!Number.isInteger(count) || count < 1 || (cart.find(item => item.id === id)?.quantity || 0) + count > 20) {
      setNotice('You can add up to 20 of each dish.');
      return false;
    }
    setCart(lines => lines.some(line => line.id === id) ? lines.map(line => line.id === id ? {
      ...line,
      quantity: line.quantity + count
    } : line) : [...lines, {
      id,
      quantity: count
    }]);
    setNotice(`Good choice! ${menu.find(item => item.id === id).name} added to your bag.`);
    return true;
  }
  function quantity(id, delta) {
    setCart(lines => lines.map(line => line.id === id ? {
      ...line,
      quantity: Math.min(20, line.quantity + delta)
    } : line).filter(line => line.quantity > 0));
  }
  function authenticate(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const email = data.email.trim().toLowerCase();
    if (authMode === 'signup') {
      if (!data.name.trim()) return setNotice('Please enter your name.');
      if (data.password !== data.confirm) return setNotice('Your passwords do not match.');
      if (accounts.some(a => a.email === email)) return setNotice('This email already has a demo account. Please log in.');
      const account = {
        name: data.name.trim(),
        email,
        password: data.password,
        phone: data.phone,
        role: 'customer'
      };
      setAccounts(list => [...list, account]);
      setUser({
        name: account.name,
        email,
        phone: account.phone,
        role: 'customer'
      });
      go(afterLogin);
      setNotice('Demo account created. Welcome to KaonHub!');
    } else {
      const account = accounts.find(a => a.email === email && a.password === data.password);
      if (!account) return setNotice('Email or password is incorrect. Try a sample account below.');
      setUser({
        name: account.name,
        email: account.email,
        phone: account.phone || '',
        role: account.role
      });
      go(account.role === 'admin' ? 'admin' : afterLogin);
      setNotice(`Welcome back, ${account.name}!`);
    }
  }
  function submitBooking(event) {
    event.preventDefault();
    if (!user) return requireLogin('reserve');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (new Date(`${visitDate}T${visitTime}`) <= new Date()) return setNotice('Choose a future reservation date and time.');
    if (!slotsLeft) return setNotice('This time slot is full. Please choose another date or time.');
    if (preorder && !cart.length) return setNotice('Add food to your cart first, or uncheck the preorder option.');
    if (preorder && cartItems.some(item => !item.available)) return setNotice('A preorder item is sold out. Please update your cart.');
    const booking = {
      ...data,
      id: newId('KH-R'),
      email: user.email,
      name: user.name,
      date: visitDate,
      time: visitTime,
      guests: Number(data.guests),
      status: 'Pending',
      items: preorder ? cartItems.map(item => ({
        ...item
      })) : [],
      total: preorder ? subtotal : 0
    };
    setBookings(list => [booking, ...list]);
    if (preorder) setCart([]);
    setPreorder(false);
    go('activity');
    setNotice(`Reservation ${booking.id} requested. Waiting for restaurant confirmation.`);
  }
  function placeOrder(event) {
    event.preventDefault();
    if (!user) return requireLogin('cart');
    if (!cart.length) return setNotice('Your cart is empty. Add a dish first.');
    if (cartItems.some(item => !item.available)) return setNotice('An item is now sold out. Remove it before checkout.');
    if (service === 'Delivery' && zone === 'Outside service area') return setNotice('Delivery is unavailable in that sample zone. Choose another zone or pickup.');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setOrders(list => [{
      ...data,
      id: newId('KH-O'),
      createdAt: new Date().toISOString(),
      email: user.email,
      name: user.name,
      items: cartItems.map(item => ({
        ...item
      })),
      service,
      zone: service === 'Delivery' ? zone : null,
      total: subtotal + deliveryFee,
      step: 0,
      cancelled: false
    }, ...list]);
    setCart([]);
    go('activity');
    setNotice('Your demo order was placed. Restaurant staff can update it from the admin dashboard.');
  }
  function bookingStatus(id, status) {
    setBookings(list => list.map(b => b.id === id ? {
      ...b,
      status
    } : b));
  }
  function nextOrder(id) {
    setOrders(list => list.map(o => o.id === id ? {
      ...o,
      step: Math.min(o.step + 1, 4)
    } : o));
  }
  function addDish(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (!data.name.trim() || !data.note.trim()) return setNotice('Enter a dish name and description.');
    setMenu(list => [...list, {
      ...data,
      name: data.name.trim(),
      id: newId('FOOD'),
      price: Number(data.price),
      emoji: '🍽️',
      color: 'sage',
      tag: 'New on the menu',
      available: true
    }]);
    event.currentTarget.reset();
    setNotice('New dish added to the demo menu.');
  }
  function saveReview(type, targetId, data) {
    const target = (type === 'booking' ? bookings : orders).find(item => item.id === targetId);
    if (!canReview(user, type, target)) {
      setNotice('Only the customer can review their own completed visit or order.');
      return false;
    }
    const delivery = type === 'order' && target.service === 'Delivery';
    const error = validateReviewInput(data, delivery);
    if (error) { setNotice(error); return false; }
    const now = new Date().toISOString();
    const record = {
      id: newId('KH-V'), type, targetId, email: user.email,
      firstName: user.name.trim().split(/\s+/)[0],
      service: type === 'booking' ? 'Dine-in visit' : target.service,
      rating: Number(data.rating), comment: data.comment.trim(),
      deliveryRating: delivery && data.deliveryRating ? Number(data.deliveryRating) : null,
      createdAt: now, updatedAt: now
    };
    setReviews(previous => {
      const existing = previous.find(review => review.type === type && review.targetId === targetId);
      const updated = existing ? { ...existing, ...record, id: existing.id, createdAt: existing.createdAt, reply: existing.reply } : record;
      return [updated, ...previous.filter(review => !(review.type === type && review.targetId === targetId))];
    });
    setNotice('Your review has been saved. Thank you for your feedback!');
    return true;
  }
  function replyToReview(id, text) {
    if (user?.role !== 'admin') return false;
    const reply = String(text || '').trim();
    if (!reply || reply.length > 500) { setNotice('Write a reply between 1 and 500 characters.'); return false; }
    if (!reviews.some(review => review.id === id)) return false;
    setReviews(previous => previous.map(review => review.id === id ? { ...review, reply } : review));
    setNotice('Restaurant reply saved.');
    return true;
  }
  const mineBookings = bookings.filter(b => b.email === user?.email);
  const mineOrders = orders.filter(o => o.email === user?.email);
  return <div className="app-shell">
    <FixedNavigation>
    <div className="top-strip">
      <span>From our kitchen, with love.</span>

    </div>
    <header className="site-header">
      <Brand onClick={() => go('home')} />
      <nav aria-label="Main navigation">
        <button className={view === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => go('home')}>Home</button>
        <button className={view === 'menu' ? 'nav-link active' : 'nav-link'} onClick={() => go('menu')}>Our menu</button>
        <button className={view === 'reserve' ? 'nav-link active' : 'nav-link'} onClick={() => requireLogin('reserve')}>Reserve a table</button>
        <button className={view === 'activity' ? 'nav-link active' : 'nav-link'} onClick={() => requireLogin('activity')}>My activity</button>
        <button className={view === 'reviews' ? 'nav-link active' : 'nav-link'} onClick={() => go('reviews')}>Reviews</button>
        {user?.role === 'admin' && <button className={view === 'admin' ? 'nav-link active' : 'nav-link'} onClick={() => go('admin')}>Admin</button>}
      </nav>
      <div className="header-actions">
        <button className="cart-button" onClick={() => go('cart')} aria-label={`Cart, ${itemCount} items`}>Bag <span key={itemCount} className={itemCount ? 'cart-count cart-count-updated' : 'cart-count'}>
            {itemCount}
          </span></button>
        {user ? <button className="login-button" onClick={() => {
          setUser(null);
          go('home');
          setNotice('You have logged out. Your cart is still here.');
        }}>Log out</button> : <button className="login-button" onClick={() => {
          setAuthMode('login');
          setAfterLogin('activity');
          go('auth');
        }}>Log in</button>}
      </div>
    </header>
    </FixedNavigation>
    <main>
      <div className={`notice ${notice ? 'visible' : ''}`} role="status" aria-live="polite">
        {notice}
        {notice && <button onClick={() => setNotice('')} aria-label="Dismiss notification">×</button>}
      </div>
      <div className="page-transition" key={view}>
      {view === 'home' && <Home onView={setSelectedFood} add={add} go={go} menu={menu} requireLogin={requireLogin} setService={setService} />}
      {view === 'menu' && <Menu onView={setSelectedFood} add={add} category={category} query={query} setCategory={setCategory} setQuery={setQuery} shownMenu={shownMenu} />}
      {view === 'auth' && <Login authMode={authMode} authenticate={authenticate} setAuthMode={setAuthMode} setNotice={setNotice} />}
      {view === 'reserve' && user && <Reservation go={go} itemCount={itemCount} preorder={preorder} setPreorder={setPreorder} setVisitDate={setVisitDate} setVisitTime={setVisitTime} slotsLeft={slotsLeft} submitBooking={submitBooking} subtotal={subtotal} user={user} visitDate={visitDate} visitTime={visitTime} />}
      {view === 'cart' && <Checkout cart={cart} cartItems={cartItems} deliveryFee={deliveryFee} go={go} itemCount={itemCount} placeOrder={placeOrder} quantity={quantity} requireLogin={requireLogin} service={service} setCart={setCart} setService={setService} setZone={setZone} subtotal={subtotal} user={user} zone={zone} />}
      {view === 'activity' && user && <CustomerDashboard reviews={reviews} saveReview={saveReview} bookingStatus={bookingStatus} go={go} mineBookings={mineBookings} mineOrders={mineOrders} setNotice={setNotice} user={user} />}
      {view === 'reviews' && <Reviews reviews={reviews} user={user} onReply={replyToReview} go={go} />}
      {view === 'admin' && user?.role === 'admin' && <AdminDashboard addDish={addDish} adminTab={adminTab} bookingStatus={bookingStatus} bookings={bookings} menu={menu} nextOrder={nextOrder} orders={orders} setAdminTab={setAdminTab} setMenu={setMenu} setOrders={setOrders} />}
      </div>
    </main>
    <FoodDetails key={selectedFood || 'closed'} item={menu.find(item => item.id === selectedFood)} onClose={() => setSelectedFood(null)} onAdd={add}
      reviews={reviews.filter(review => {
        const target = (review.type === 'booking' ? bookings : orders).find(activity => activity.id === review.targetId);
        const completed = review.type === 'booking' ? target?.status === 'Completed' : target?.step === 4 && !target?.cancelled;
        return completed && target?.items?.some(item => item.id === selectedFood);
      })} />
    <footer className="site-footer">
      <div>
        <Brand onClick={() => go('home')} />
        <p>Reserve a table. Order your favorites. Kaon na!</p>
      </div>
      <div className="footer-details">
        <strong>Made for good company.</strong>
        <p>Menu · Reservations · Delivery & pickup</p>
        <small>KaonHub / React Lab 3 · Classroom prototype</small>
      </div>
    </footer>
  </div>;
}
