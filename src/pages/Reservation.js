import React, { useState } from 'react';
import { tables, tableAvailable } from '../utils/tables';
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
  bookings,
  submitBooking,
  subtotal,
  user,
  visitDate,
  visitTime
}) {
  const [guests, setGuests] = useState(2);
  const [preference, setPreference] = useState('No preference');
  const [selection, setSelection] = useState(null);
  const [suggestion, setSuggestion] = useState('');
  const available = tables.filter(table => tableAvailable(table, bookings, visitDate, visitTime, guests));
  const selected = available.find(table => table.id === selection?.id && selection.date === visitDate && selection.time === visitTime && selection.guests === guests);
  const nextTime = times.find(time => time > visitTime && tables.some(table => tableAvailable(table, bookings, visitDate, time, guests)));
  function choose(table) { setSelection({ id: table.id, date: visitDate, time: visitTime, guests }); }
  function recommend() {
    const ranked = [...available].sort((a,b) => Number(b.location === preference) - Number(a.location === preference) || a.seats - b.seats);
    if (!ranked.length) return setSuggestion('No suitable tables at this time. Try another time or date.');
    choose(ranked[0]);
    setSuggestion(ranked[0].name + ' selected · ' + ranked[0].location + (preference !== 'No preference' && ranked[0].location !== preference ? '. Your preferred location is unavailable; this is the best available fit.' : '.'));
  }
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
          <label>Number of guests<select name="guests" value={guests} onChange={event => { setGuests(Number(event.target.value)); setSuggestion(''); }}>
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>
                {n}
                {n === 1 ? 'guest' : 'guests'}
              </option>)}
            </select></label>
          <label>Table preference<select value={preference} onChange={event => { setPreference(event.target.value); setSuggestion(''); }}>
            {['No preference', 'Window seat', 'Quiet corner', 'Family seating', 'Garden seating'].map(value => <option key={value}>{value}</option>)}
          </select></label>
          <label className="span-two">Contact number<input name="phone" type="tel" defaultValue={user.phone} autoComplete="tel" required pattern="[0-9+ ()-]{7,20}" /></label>
        </div>
        <section className="table-picker" aria-labelledby="table-map-heading">
          <h3 id="table-map-heading">Choose your table</h3>
          <p>{available.length} of {tables.length} tables fit your group and time. Each booking lasts two hours.</p>
          <div className="table-legend"><span>● Available</span><span>◉ Selected</span><span>▧ Unavailable</span></div>
          <div className="table-map">{tables.map(table => {
            const fits = table.seats >= guests;
            const free = available.some(item => item.id === table.id);
            const active = selected?.id === table.id;
            return <button type="button" key={table.id} className={'table-seat ' + (active ? 'is-selected' : free ? 'is-available' : 'is-unavailable')} disabled={!free} aria-pressed={active} onClick={() => { choose(table); setSuggestion(''); }}>
              <span className="table-seat-icon" aria-hidden="true">▦</span><strong>{table.name}</strong><span>{table.seats} seats · {table.area}</span><small>{table.location}</small><span>{active ? 'Selected' : !fits ? 'Too small for your group' : free ? 'Available' : 'Unavailable at this time'}</span>
            </button>;
          })}</div>
          <input type="hidden" name="tableId" value={selected?.id || ''} />
          <button type="button" className="secondary" onClick={recommend}>Find my best table</button>
          <p role="status">{suggestion || (selected ? selected.name + ' selected.' : 'Select an available table to continue.')}</p>
          {!available.length && nextTime && <button type="button" className="text-button" onClick={() => { setVisitTime(nextTime); setSuggestion(''); }}>Try {niceTime(nextTime)} — tables available →</button>}
          {!available.length && !nextTime && <p>Try another date for more available tables.</p>}
        </section>
        <label>Special requests<textarea name="requests" maxLength={300} placeholder="Allergies, accessibility needs, or a special occasion" /></label>
        <label className="checkbox-label"><input type="checkbox" checked={preorder} onChange={e => setPreorder(e.target.checked)} />Include my cart as a food preorder ({itemCount} items)</label>
        {preorder && <p>Preorder total: <strong>
            {peso(subtotal)}
          </strong>. Pay at the restaurant. <button type="button" className="inline-button" onClick={() => go('menu')}>Browse menu</button></p>}
        <button className="primary full-width" disabled={!selected}>Request reservation →</button>
      </form>
      <aside className="booking-aside">
        <div className="aside-art" aria-hidden="true">✳</div>
        <span className="eyebrow">A LITTLE PLANNING, A LOT OF GOOD FOOD</span>
        <h2>Bring your people.<br />We’ll handle the rest.</h2>
        <ul>
          <li>Up to 6 guests per table.</li>
          <li>Two-hour dining slots.</li>
          <li>Choose a window, quiet corner, family, or garden table.</li>
          <li>Optional meals ordered ahead.</li>
        </ul>
        <div className="availability"><span className="tiny-dot" />{available.length} of {tables.length} tables available for your group</div>
        <small>Availability is shared within this demo session and resets on refresh. Live availability across customers needs a shared database. Pending requests hold the selected table until cancelled or declined.</small>
      </aside>
    </div>
  </section>;
}
