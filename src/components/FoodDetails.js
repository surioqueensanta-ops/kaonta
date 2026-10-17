import React, { useEffect, useRef, useState } from 'react';
import { peso } from '../utils/formatters';
import './FoodDetails.css';

export default function FoodDetails({ item, reviews, onClose, onAdd }) {
  const dialog = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!item) return;
    const previousFocus = document.activeElement;
    const modal = dialog.current;
    modal.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [item]);
  if (!item) return null;
  const average = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : null;
  return <dialog ref={dialog} className="food-details" aria-labelledby="food-details-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <button type="button" className="food-details-close" aria-label="Close food details" onClick={onClose} autoFocus>×</button>
    <div className="food-details-layout">
      <div className={'food-details-image ' + item.color}>
        {item.image ? <img src={item.image} alt={item.name} style={{ objectPosition: item.imagePosition || 'center' }} /> : <span role="img" aria-label={item.name}>{item.emoji}</span>}
      </div>
      <div className="food-details-copy">
        <span className="eyebrow">{item.category}</span>
        <h2 id="food-details-title">{item.name}</h2>
        <strong className="food-details-price">{peso(item.price)}</strong>
        <p>{item.note}</p>
        <p className="food-details-availability">{item.available ? '● Available to order' : 'Currently sold out'}</p>
        <form onSubmit={event => { event.preventDefault(); const success = onAdd(item.id, quantity); setMessage(success ? quantity + ' × ' + item.name + ' added to your bag.' : 'Your bag can hold up to 20 of each dish. Please check your quantity.'); }}>
          <label htmlFor="food-details-quantity">Quantity</label>
          <div className="food-details-actions">
            <input id="food-details-quantity" type="number" min="1" max="20" required value={quantity} onChange={event => setQuantity(event.target.value === '' ? '' : Number(event.target.value))} disabled={!item.available} />
            <button className="primary" disabled={!item.available}>{item.available ? 'Add to Bag · ' + peso(item.price * (quantity || 0)) : 'Sold out'}</button>
          </div>
        </form>
        <p className="food-details-feedback" role="status">{message}</p>
      </div>
    </div>
    <section className="food-details-reviews" aria-labelledby="food-reviews-title">
      <h3 id="food-reviews-title">Customer experiences {average && <span>· {average}/5</span>}</h3>
      <p>Reviews from completed orders or dine-in preorders containing this dish. Ratings describe the whole experience, including any other items ordered.</p>
      {!reviews.length && <p className="food-details-empty">No reviews from orders containing this dish yet.</p>}
      {reviews.map(review => <article className="food-details-review" key={review.id}>
        <div><strong>{review.firstName}</strong><small>✓ {review.type === 'booking' ? 'Completed visit' : 'Completed order'} · {review.service}</small></div>
        <p className="food-details-stars" aria-label={review.rating + ' out of 5 stars'}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
        <p>{review.comment}</p>
        {review.reply && <blockquote><strong>KaonHub replied</strong><p>{review.reply}</p></blockquote>}
      </article>)}
      <small>To leave or edit a review, open My activity after your delivery, pickup, or dine-in visit is completed.</small>
    </section>
  </dialog>;
}
