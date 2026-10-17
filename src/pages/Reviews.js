import React from 'react';
import PageHeading from '../components/PageHeading';
import './Reviews.css';

function reviewDate(value) {
  return new Date(value).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Reviews({ reviews, user, onReply, go }) {
  const average = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : null;
  return <section className="section-wrap reviews-page">
    <PageHeading eyebrow="FROM OUR CUSTOMERS" title="Good meals leave good stories.">Reviews from completed dine-in visits, delivered orders, and collected pickups.</PageHeading>
    <div className="reviews-summary"><div><span className="reviews-average">{average || '—'}<small>/ 5</small></span>
      <p>{reviews.length} {reviews.length === 1 ? 'customer review' : 'customer reviews'}</p></div>
      <div><strong>From real activity in this demo</strong><p>One review per completed booking or order. Every rating, including critical feedback, contributes to the average.</p></div>
    </div>
    {!reviews.length && <div className="empty-state"><h2>Your story could be the first.</h2>
      <p>After your visit or order is completed, open My activity and select Leave a review.</p>
      <button className="secondary" onClick={() => go('menu')}>Explore our menu</button>
    </div>}
    <div className="reviews-list">{reviews.map(review => <article className="surface customer-review" key={review.id}>
      <div className="review-card-top"><div className="review-author"><span className="review-avatar" aria-hidden="true">{review.firstName.slice(0, 1).toUpperCase()}</span>
        <div><h3>{review.firstName}</h3><small>{reviewDate(review.createdAt)}{review.updatedAt !== review.createdAt ? ' · Edited' : ''}</small></div></div>
        <span className="verified-review">✓ {review.type === 'booking' ? 'Verified Visit' : 'Verified Order'}</span></div>
      <div className="published-stars" role="img" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}<span>{'☆'.repeat(5 - review.rating)}</span></div>
      <small className="review-service">{review.service}{review.deliveryRating ? ` · Delivery experience ${review.deliveryRating}/5` : ''}</small>
      <p className="review-comment">{review.comment}</p>
      {review.reply && <div className="restaurant-reply"><strong>KaonHub replied</strong><p>{review.reply}</p></div>}
      {user?.role === 'admin' && <form className="review-reply-form" onSubmit={event => {
        event.preventDefault();
        const form = event.currentTarget;
        onReply(review.id, new FormData(form).get('reply'));
      }}>
        <label>Restaurant reply<textarea key={review.reply || 'new-reply'} name="reply" required maxLength={500} defaultValue={review.reply || ''} placeholder="Thank the customer or respond to their feedback." /></label>
        <button className="secondary">{review.reply ? 'Update reply' : 'Post reply'}</button>
      </form>}
      {user?.email === review.email && user?.role === 'customer' && <button className="text-button" onClick={() => go('activity')}>Edit through My activity →</button>}
    </article>)}</div>
  </section>;
}
