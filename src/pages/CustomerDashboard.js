import React from 'react';
import { peso, stepsFor, niceDate, niceTime } from '../utils/formatters';
import PageHeading from '../components/PageHeading';
import Status from '../components/Status';
import './CustomerDashboard.css';

// Edit this screen's HTML-like JSX below. Shared state arrives through props.
export default function CustomerDashboard({
  bookingStatus,
  go,
  mineBookings,
  mineOrders,
  setNotice,
  user
}) {
  return <section className="section-wrap">
    <PageHeading eyebrow={`YOUR KAONHUB / ${user.name}`} title="Good things on the way.">Your orders and table reservations, together in one place.</PageHeading>
    <h2 className="list-heading">Table reservations <span>
        {mineBookings.length}
      </span></h2>
    {!mineBookings.length && <div className="small-empty">
      <p>No reservations yet. Make room for your next gathering.</p>
      <button className="secondary" onClick={() => go('reserve')}>Reserve a table</button>
    </div>}
    {mineBookings.map(b => <article className="surface activity-card" key={b.id}>
      <div className="activity-top">
        <div>
          <small className="record-id">
            {b.id}
          </small>
          <h3>{niceDate(b.date)} · {niceTime(b.time)}</h3>
        </div>
        <Status>
          {b.status}
        </Status>
      </div>
      <p>{b.guests} guests · {b.seating} seating preference</p>
      {b.items.length > 0 && <p>Preorder: {b.items.map(i => `${i.name} × ${i.quantity}`).join(', ')} · {peso(b.total)}</p>}
      {['Pending', 'Confirmed'].includes(b.status) && <button className="secondary" disabled={new Date(`${b.date}T${b.time}`) <= new Date()} onClick={() => {
        bookingStatus(b.id, 'Cancelled');
        setNotice('Reservation cancelled. Your sample table has been released.');
      }}>Cancel reservation</button>}
    </article>)}
    <h2 className="list-heading">Food orders <span>
        {mineOrders.length}
      </span></h2>
    {!mineOrders.length && <div className="small-empty">
      <p>Your next favorite meal is waiting on our menu.</p>
      <button className="secondary" onClick={() => go('menu')}>Browse menu</button>
    </div>}
    {mineOrders.map(o => <article className="surface activity-card" key={o.id}>
      <div className="activity-top">
        <div>
          <small className="record-id">
            {o.id}
          </small>
          <h3>{o.service} · {peso(o.total)}</h3>
        </div>
        <Status>
          {o.cancelled ? 'Declined' : stepsFor(o.service)[o.step]}
        </Status>
      </div>
      <p>
        {o.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}
      </p>
      {o.service === 'Delivery' && <p>Deliver to: {o.address}</p>}
      {!o.cancelled && <ol className="order-progress">
        {stepsFor(o.service).map((s, i) => <li key={s} className={i <= o.step ? 'reached' : ''} aria-current={i === o.step ? 'step' : undefined}>
          <span>
            {i < o.step ? '✓' : i + 1}
          </span>
          {s}
        </li>)}
      </ol>}
      <small>Status updates are entered by the restaurant through the demo admin account.</small>
    </article>)}
  </section>;
}
