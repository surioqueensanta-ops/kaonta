import React, { useState } from 'react';
import './App.css';
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

// App coordinates shared data and navigation. Edit screen layouts in src/pages.
export default function App() {
  const [view, setView] = useState('home');
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
  const [notice, setNotice] = useState('');
  const [service, setService] = useState('Delivery');
  const [zone, setZone] = useState('Central zone');
  const [preorder, setPreorder] = useState(false);
  const [adminTab, setAdminTab] = useState('Reservations');
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
      behavior: 'smooth'
    });
  }
  function requireLogin(next) {
    if (user) return go(next);
    setAfterLogin(next);
    setAuthMode('login');
    go('auth');
    setNotice('Please log in or create a demo account to continue.');
  }
  function add(id) {
    if (!menu.find(item => item.id === id)?.available) return;
    setCart(lines => lines.some(line => line.id === id) ? lines.map(line => line.id === id ? {
      ...line,
      quantity: Math.min(20, line.quantity + 1)
    } : line) : [...lines, {
      id,
      quantity: 1
    }]);
    setNotice(`${menu.find(item => item.id === id).name} added to your order.`);
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
        {user?.role === 'admin' && <button className={view === 'admin' ? 'nav-link active' : 'nav-link'} onClick={() => go('admin')}>Admin</button>}
      </nav>
      <div className="header-actions">
        <button className="cart-button" onClick={() => go('cart')} aria-label={`Cart, ${itemCount} items`}>Bag <span>
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
        }}>Log in <span aria-hidden="true">↗</span></button>}
      </div>
    </header>
    </FixedNavigation>
    <main>
      <div className={`notice ${notice ? 'visible' : ''}`} role="status" aria-live="polite">
        {notice}
        {notice && <button onClick={() => setNotice('')} aria-label="Dismiss notification">×</button>}
      </div>
      {view === 'home' && <Home add={add} go={go} menu={menu} requireLogin={requireLogin} setService={setService} />}
      {view === 'menu' && <Menu add={add} category={category} query={query} setCategory={setCategory} setQuery={setQuery} shownMenu={shownMenu} />}
      {view === 'auth' && <Login authMode={authMode} authenticate={authenticate} setAuthMode={setAuthMode} setNotice={setNotice} />}
      {view === 'reserve' && user && <Reservation go={go} itemCount={itemCount} preorder={preorder} setPreorder={setPreorder} setVisitDate={setVisitDate} setVisitTime={setVisitTime} slotsLeft={slotsLeft} submitBooking={submitBooking} subtotal={subtotal} user={user} visitDate={visitDate} visitTime={visitTime} />}
      {view === 'cart' && <Checkout cart={cart} cartItems={cartItems} deliveryFee={deliveryFee} go={go} itemCount={itemCount} placeOrder={placeOrder} quantity={quantity} requireLogin={requireLogin} service={service} setCart={setCart} setService={setService} setZone={setZone} subtotal={subtotal} user={user} zone={zone} />}
      {view === 'activity' && user && <CustomerDashboard bookingStatus={bookingStatus} go={go} mineBookings={mineBookings} mineOrders={mineOrders} setNotice={setNotice} user={user} />}
      {view === 'admin' && user?.role === 'admin' && <AdminDashboard addDish={addDish} adminTab={adminTab} bookingStatus={bookingStatus} bookings={bookings} menu={menu} nextOrder={nextOrder} orders={orders} setAdminTab={setAdminTab} setMenu={setMenu} setOrders={setOrders} />}
    </main>
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
