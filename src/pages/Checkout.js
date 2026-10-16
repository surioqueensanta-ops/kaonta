import React from 'react';
import { peso } from '../utils/formatters';
import PageHeading from '../components/PageHeading';
import './Checkout.css';

// Edit this screen's HTML-like JSX below. Shared state arrives through props.
export default function Checkout({
  cart,
  cartItems,
  deliveryFee,
  go,
  itemCount,
  placeOrder,
  quantity,
  requireLogin,
  service,
  setCart,
  setService,
  setZone,
  subtotal,
  user,
  zone
}) {
  return <section className="section-wrap">
    <PageHeading eyebrow="A LITTLE SOMETHING DELICIOUS" title="Your food, your way.">Choose delivery or pickup. Review your bag before placing an order.</PageHeading>
    {!cart.length ? <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">🍽️</span>
      <h2>Good food belongs here.</h2>
      <p>Your bag is empty. Let’s find you something delicious.</p>
      <button className="primary" onClick={() => go('menu')}>Explore our menu →</button>
    </div> : <div className="checkout-layout">
      <div className="surface">
        <h2>Your bag <span className="subtle">({itemCount})</span></h2>
        {cartItems.map(item => <div className="cart-line" key={item.id}>
          <span className={`cart-art ${item.color}`} aria-hidden="true">
            {item.image ? <img className="cart-photo" src={item.image} alt=""
              style={{ objectPosition: item.imagePosition || 'center' }} /> : item.emoji}
          </span>
          <div className="cart-dish">
            <h3>
              {item.name}
            </h3>
            <small>{peso(item.price)} each{!item.available && ' · Sold out'}</small>
            <div className="quantity-control">
              <button aria-label={`Decrease ${item.name}`} onClick={() => quantity(item.id, -1)}>−</button>
              <span>
                {item.quantity}
              </span>
              <button aria-label={`Increase ${item.name}`} disabled={item.quantity >= 20} onClick={() => quantity(item.id, 1)}>+</button>
            </div>
          </div>
          <strong>
            {peso(item.price * item.quantity)}
          </strong>
          <button className="remove-button" aria-label={`Remove ${item.name}`} onClick={() => setCart(lines => lines.filter(line => line.id !== item.id))}>×</button>
        </div>)}
        <button className="text-button" onClick={() => go('menu')}>← Add more favorites</button>
      </div>
      <form className="surface order-summary" onSubmit={placeOrder}>
        <h2>The finishing touches</h2>
        <div className="service-switch">
          {['Delivery', 'Pickup'].map(s => <button type="button" key={s} aria-pressed={service === s} className={service === s ? 'selected' : ''} onClick={() => setService(s)}>
            {s}
          </button>)}
        </div>
        {service === 'Delivery' ? <>
          <label>Sample delivery zone<select value={zone} onChange={e => setZone(e.target.value)}>
              <option>Central zone</option>
              <option>Nearby zone</option>
              <option>Outside service area</option>
            </select></label>
          <label>Delivery address<input name="address" autoComplete="street-address" required maxLength={200} /></label>
        </> : <p className="checkout-note">Pickup is prepared as soon as the demo restaurant confirms your order. Track when it is ready.</p>}
        <label>Contact number<input name="phone" type="tel" autoComplete="tel" defaultValue={user?.phone || ''} required pattern="[0-9+ ()-]{7,20}" /></label>
        <label>Order notes <span className="subtle">(optional)</span><textarea name="notes" maxLength={250} placeholder="Anything we should know?" /></label>
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>
            {peso(subtotal)}
          </strong>
        </div>
        <div className="summary-row">
          <span>Delivery fee</span>
          <strong>
            {peso(deliveryFee)}
          </strong>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <strong>
            {peso(subtotal + deliveryFee)}
          </strong>
        </div>
        <p className="checkout-note">Pay on {service === 'Delivery' ? 'delivery' : 'pickup'}. Sample zones and fees; no online payment is collected.</p>
        {user ? <button className="primary full-width">Place demo order →</button> : <button type="button" className="primary full-width" onClick={() => requireLogin('cart')}>Log in to checkout →</button>}
      </form>
    </div>}
  </section>;
}
