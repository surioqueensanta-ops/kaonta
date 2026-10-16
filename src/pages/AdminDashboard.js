import React from 'react';
import { categories } from '../data/restaurantData';
import { peso, stepsFor, niceDate, niceTime } from '../utils/formatters';
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
  return <section className="section-wrap">
    <PageHeading eyebrow="KAONHUB / RESTAURANT DESK" title="A good service starts here.">Manage the menu, welcome your guests, and keep orders moving. Admin controls are a front-end classroom simulation.</PageHeading>
    <div className="metric-grid">
      <div>
        <small>Pending reservations</small>
        <strong>
          {bookings.filter(b => b.status === 'Pending').length}
        </strong>
      </div>
      <div>
        <small>Active food orders</small>
        <strong>
          {orders.filter(o => !o.cancelled && o.step < 4).length}
        </strong>
      </div>
      <div>
        <small>Completed order sales</small>
        <strong>
          {peso(orders.filter(o => !o.cancelled && o.step === 4).reduce((s, o) => s + o.total, 0))}
        </strong>
      </div>
    </div>
    <div className="category-list admin-tabs">
      {['Reservations', 'Orders', 'Menu management'].map(tab => <button key={tab} className={adminTab === tab ? 'chip selected' : 'chip'} onClick={() => setAdminTab(tab)}>
        {tab}
      </button>)}
    </div>
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
      {!orders.length && <div className="empty-state">
        <h2>No food orders yet.</h2>
        <p>Submitted orders will appear here.</p>
      </div>}
      {orders.map(o => <article className="surface activity-card" key={o.id}>
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
  </section>;
}
