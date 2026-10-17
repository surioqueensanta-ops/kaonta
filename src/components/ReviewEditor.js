import React, { useState } from 'react';
import './ReviewEditor.css';

export default function ReviewEditor({ review, onSave, delivery, referenceId }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || '');
  const [deliveryRating, setDeliveryRating] = useState(review?.deliveryRating || '');

  function edit() {
    setRating(review?.rating || 0);
    setComment(review?.comment || '');
    setDeliveryRating(review?.deliveryRating || '');
    setOpen(true);
  }
  function submit(event) {
    event.preventDefault();
    if (onSave({ rating, comment, deliveryRating })) setOpen(false);
  }

  return <div className="review-editor">
    {!open ? <div className="review-invitation">
      <div><strong>{review ? 'Thanks for sharing your experience.' : 'How was your experience?'}</strong>
        <p>{review ? `Your rating: ${review.rating} out of 5 stars.` : 'Your completed visit or order is eligible for a review.'}</p></div>
      <button className="secondary" onClick={edit}>{review ? 'Edit review' : 'Leave a review'}</button>
    </div> : <form className="review-form" onSubmit={submit}>
      <h3>{review ? 'Edit your review' : 'Tell us about your experience'}</h3>
      <fieldset className="review-rating"><legend>Overall rating</legend>
        <div className="review-star-options">{[1, 2, 3, 4, 5].map(value => <label key={value} className={value <= rating ? 'review-star-option filled' : 'review-star-option'}>
          <input type="radio" name={`rating-${referenceId}`} value={value} checked={rating === value}
            onChange={() => setRating(value)} aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`} required />
          <span aria-hidden="true">★</span>
        </label>)}</div>
        <small>{rating ? `${rating} out of 5 stars` : 'Select a star rating'}</small>
      </fieldset>
      <label>Your review<textarea value={comment} onChange={event => setComment(event.target.value)} maxLength={500} required placeholder="Tell us about the food and service." /></label>
      <small className="review-character-count">{comment.length}/500 characters</small>
      {delivery && <label>Delivery experience <span className="subtle">(optional)</span>
        <select value={deliveryRating} onChange={event => setDeliveryRating(event.target.value)}>
          <option value="">No separate rating</option>
          {[1, 2, 3, 4, 5].map(value => <option key={value} value={value}>{value} {value === 1 ? 'star' : 'stars'}</option>)}
        </select>
      </label>}
      <div className="review-form-actions"><button className="primary">{review ? 'Save review' : 'Submit review'}</button>
        <button type="button" className="secondary" onClick={() => setOpen(false)}>Cancel</button></div>
    </form>}
  </div>;
}
