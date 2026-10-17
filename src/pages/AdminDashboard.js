import React, { useState } from 'react';
import OrderDetails from '../components/OrderDetails';
import { categories } from '../data/restaurantData';
import { peso, stepsFor, niceDate, niceTime, today } from '../utils/formatters';
import PageHeading from '../components/PageHeading';
import Status from '../components/Status';
import './AdminDashboard.css';

// Edit this screen's HTML-like JSX below. Shared state arrives through props.
export default function AdminDashboard({
  addDish,
  adminTab,
  bookingStatus,
  bookings,
  menu,
  nextOrder,
  orders,
  setAdminTab,
  setMenu,
  setOrders
}) {
  const [orderFilter, setOrderFilter] = useState('All orders');
  const [serviceFilter, setServiceFilter] = useState('All services');
  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const completed = orders.filter(order => !order.cancelled && order.step === 4);
  const active = orders.filter(order => !order.cancelled && order.step < 4);
  const todaysBookings = bookings.filter(booking => booking.date === today() && !['Cancelled', 'Declined'].includes(booking.status));
  const visibleOrders = orders.filter(order => {
    const status = order.cancelled ? 'Declined' : stepsFor(order.service)[order.step];
    return (orderFilter === 'All orders' || (orderFilter === 'Completed' ? !order.cancelled && order.step === 4 : status === orderFilter)) &&
      (serviceFilter === 'All services' || order.service === serviceFilter) &&
      (order.id + ' ' + order.name).toLowerCase().includes(search.trim().toLowerCase());
  });
  const popular = new Map();
  completed.forEach(order => order.items.forEach(item => {
    const previous = popular.get(item.id) || { name: item.name, quantity: 0 };
    popular.set(item.id, { ...previous, quantity: previous.quantity + item.quantity });
  }));
  return <section className="section-wrap">
    <PageHeading eyebrow="KAONHUB / RESTAURANT DESK" title="A good service starts here.">Manage the menu, welcome your guests, and keep orders moving. Admin controls are a front-end classroom simulation.</PageHeading>
    <div className="metric-grid admin-metrics">
      <div><small>Today's reservations</small><strong>{todaysBookings.length}</strong></div>
      <div><small>Pending reservations · all dates</small><strong>{bookings.filter(b => b.status === 'Pending').length}</strong></div>
      <div><small>Active food orders</small><strong>{active.length}</strong></div>
      <div><small>Completed order value · all activity</small><strong>{peso(completed.reduce((sum, order) => sum + order.total, 0))}</strong></div>
    </div>
    <p className="admin-value-note">Completed order value includes delivery fees. Payment is not verified, so this is not a paid sales total. Dine-in preorders are excluded.</p>
    <div className="category-list admin-tabs">
      {['Overview', 'Reservations', 'Orders', 'Menu management'].map(tab => <button key={tab} className={adminTab === tab ? 'chip selected' : 'chip'} onClick={() => setAdminTab(tab)}>
        {tab}
      </button>)}
    </div>
    {adminTab === 'Overview' && <div className="admin-overview-grid">
      <section className="surface"><h2>Needs your attention</h2>
        <p>{orders.filter(order => !order.cancelled && order.step === 0).length} orders waiting for confirmation.</p>
        <p>{bookings.filter(booking => booking.status === 'Pending').length} reservation requests waiting.</p>
        <div className="button-row"><button className="primary" onClick={() => { setOrderFilter('Pending'); setAdminTab('Orders'); }}>Review pending orders</button>
          <button className="secondary" onClick={() => setAdminTab('Reservations')}>Review reservations</button></div>
      </section>
      <section className="surface"><h2>Popular dishes</h2><p>Quantities from completed delivery and pickup orders.</p>
        {!popular.size ? <p>No completed orders yet.</p> : <ol className="admin-popular">{[...popular.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5).map(item => <li key={item.name}><span>{item.name}</span><strong>{item.quantity} ordered</strong></li>)}</ol>}
      </section>
      <section className="surface admin-today"><h2>Today's tables</h2>
        {!todaysBookings.length ? <p>No active reservations for today.</p> : todaysBookings.slice().sort((a,b) => a.time.localeCompare(b.time)).map(booking => <div className="admin-today-row" key={booking.id}><span><strong>{niceTime(booking.time)} · {booking.name}</strong><small>{booking.guests} guests · {booking.seating}</small></span><Status>{booking.status}</Status></div>)}
      </section>
    </div>}
    {adminTab === 'Reservations' && <>
      {!bookings.length && <div className="empty-state">
        <h2>No reservations yet.</h2>
        <p>Customer requests will appear here.</p>
      </div>}
      {bookings.map(b => <article className="surface activity-card" key={b.id}>
        <div className="activity-top">
          <div>
            <small className="record-id">
              {b.id}
            </small>
            <h3>{b.name} · {b.guests} guests</h3>
          </div>
          <Status>
            {b.status}
          </Status>
        </div>
        <p>{niceDate(b.date)} · {niceTime(b.time)} · {b.seating} · {b.phone}</p>
        {b.requests && <p>Request: {b.requests}</p>}
        {b.items.length > 0 && <p>Preorder: {b.items.map(i => `${i.name} × ${i.quantity}`).join(', ')} · {peso(b.total)}</p>}
        <div className="button-row">
          {b.status === 'Pending' && <>
            <button className="primary" onClick={() => bookingStatus(b.id, 'Confirmed')}>Confirm reservation</button>
            <button className="secondary" onClick={() => bookingStatus(b.id, 'Declined')}>Decline</button>
          </>}
          {b.status === 'Confirmed' && <button className="secondary" onClick={() => bookingStatus(b.id, 'Completed')}>Mark completed</button>}
        </div>
      </article>)}
    </>}
    {adminTab === 'Orders' && <>
      <div className="admin-order-filters">
        <label>Order status<select value={orderFilter} onChange={event => setOrderFilter(event.target.value)}>{['All orders', 'Pending', 'Confirmed', 'Preparing', 'Out for delivery', 'Ready for pickup', 'Completed', 'Declined'].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Service<select value={serviceFilter} onChange={event => setServiceFilter(event.target.value)}>{['All services', 'Delivery', 'Pickup'].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Search orders<input type="search" value={search} placeholder="Customer name or order ID" onChange={event => setSearch(event.target.value)} /></label>
      </div>
      <p>{visibleOrders.length} of {orders.length} orders shown</p>
      {!!orders.length && !visibleOrders.length && <div className="empty-state"><h2>No matching orders.</h2><button className="secondary" onClick={() => { setOrderFilter('All orders'); setServiceFilter('All services'); setSearch(''); }}>Clear filters</button></div>}
      {!orders.length && <div className="empty-state">
        <h2>No food orders yet.</h2>
        <p>Submitted orders will appear here.</p>
      </div>}
      {visibleOrders.map(o => <article className="surface activity-card" key={o.id}>
        <div className="activity-top">
          <div>
            <small className="record-id">
              {o.id}
            </small>
            <h3>{o.name} · {o.service} · {peso(o.total)}</h3>
          </div>
          <Status>
            {o.cancelled ? 'Declined' : stepsFor(o.service)[o.step]}
          </Status>
        </div>
        <p>
          {o.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}
        </p>
        <p>
          {o.phone}
          {o.address ? ` · ${o.address} (${o.zone})` : ''}
        </p>
        {o.notes && <p>Notes: {o.notes}</p>}
        <div className="button-row">
          <button className="secondary" onClick={() => setSelectedOrderId(o.id)} aria-label={`View details for order ${o.id}`}>View details</button>
          <button className="primary" disabled={o.cancelled || o.step >= 4} onClick={() => nextOrder(o.id)}>
            {o.step < 4 && !o.cancelled ? `Mark ${stepsFor(o.service)[o.step + 1]}` : 'No further updates'}
          </button>
          {o.step === 0 && !o.cancelled && <button className="secondary" onClick={() => setOrders(list => list.map(item => item.id === o.id ? {
            ...item,
            cancelled: true
          } : item))}>Decline order</button>}
        </div>
      </article>)}
    </>}
    {adminTab === 'Menu management' && <div className="two-column">
      <div className="surface">
        <h2>What’s cooking?</h2>
        {menu.map(item => <div className="menu-management-row" key={item.id}>
          <div>
            <strong>
              {item.name}
            </strong>
            <small>
              {peso(item.price)}
            </small>
          </div>
          <button className="secondary" aria-label={`${item.available ? 'Mark sold out' : 'Make available'}: ${item.name}`} onClick={() => setMenu(list => list.map(d => d.id === item.id ? {
            ...d,
            available: !d.available
          } : d))}>
            {item.available ? 'Available' : 'Sold out'}
          </button>
        </div>)}
      </div>
      <form className="surface" onSubmit={addDish}>
        <h2>Add a dish</h2>
        <label>Dish name<input name="name" required maxLength={60} /></label>
        <label>Category<select name="category">
            {categories.slice(1).map(c => <option key={c}>
              {c}
            </option>)}
          </select></label>
        <label>Price (PHP)<input name="price" type="number" required min="1" max="10000" step="0.01" /></label>
        <label>Description<textarea name="note" required maxLength={160} /></label>
        <button className="primary full-width">Add dish to menu</button>
      </form>
    </div>}
    <OrderDetails key={selectedOrderId || 'closed'} order={orders.find(order => order.id === selectedOrderId)} onClose={() => setSelectedOrderId(null)} />
  </section>;
}
