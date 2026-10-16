import React from 'react';
import { times } from '../data/restaurantData';
import { peso, today, niceTime } from '../utils/formatters';
import PageHeading from '../components/PageHeading';
import './Reservation.css';

// Edit this screen's HTML-like JSX below. Shared state arrives through props.
export default function Reservation({
  go,
  itemCount,
  preorder,
  setPreorder,
  setVisitDate,
  setVisitTime,
  slotsLeft,
  submitBooking,
  subtotal,
  user,
  visitDate,
  visitTime
}) {
  return <section className="section-wrap">
    <PageHeading eyebrow="MAKE TIME FOR A GOOD MEAL" title="We’ll save you a seat.">Plan your visit. Your reservation is confirmed once the restaurant accepts it.</PageHeading>
    <div className="two-column">
      <form className="surface" onSubmit={submitBooking}>
        <h2>Your visit</h2>
        <p>Booking for <strong>
            {user.name}
          </strong></p>
        <div className="form-grid">
          <label>Date<input type="date" value={visitDate} min={today()} onChange={e => setVisitDate(e.target.value)} required /></label>
          <label>Time<select value={visitTime} onChange={e => setVisitTime(e.target.value)}>
              {times.map(t => <option key={t} value={t}>
                {niceTime(t)}
              </option>)}
            </select></label>
          <label>Number of guests<select name="guests" defaultValue="2">
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>
                {n}
                {n === 1 ? 'guest' : 'guests'}
              </option>)}
            </select></label>
          <label>Seating preference<select name="seating">
              <option>No preference</option>
              <option>Indoor</option>
              <option>Outdoor</option>
            </select></label>
          <label className="span-two">Contact number<input name="phone" type="tel" defaultValue={user.phone} autoComplete="tel" required pattern="[0-9+ ()-]{7,20}" /></label>
        </div>
        <label>Special requests<textarea name="requests" maxLength={300} placeholder="Allergies, accessibility needs, or a special occasion" /></label>
        <label className="checkbox-label"><input type="checkbox" checked={preorder} onChange={e => setPreorder(e.target.checked)} />Include my cart as a food preorder ({itemCount} items)</label>
        {preorder && <p>Preorder total: <strong>
            {peso(subtotal)}
          </strong>. Pay at the restaurant. <button type="button" className="inline-button" onClick={() => go('menu')}>Browse menu</button></p>}
        <button className="primary full-width" disabled={slotsLeft === 0}>Request reservation →</button>
      </form>
      <aside className="booking-aside">
        <div className="aside-art" aria-hidden="true">✳</div>
        <span className="eyebrow">A LITTLE PLANNING, A LOT OF GOOD FOOD</span>
        <h2>Bring your people.<br />We’ll handle the rest.</h2>
        <ul>
          <li>Up to 6 guests per table.</li>
          <li>Two-hour dining slots.</li>
          <li>Indoor or outdoor seating requests.</li>
          <li>Optional meals ordered ahead.</li>
        </ul>
        <div className="availability"><span className="tiny-dot" />{slotsLeft} of 5 sample tables available</div>
        <small>Demo capacity only. Seating preferences are subject to availability. Reservations can be cancelled before the visit.</small>
      </aside>
    </div>
  </section>;
}
