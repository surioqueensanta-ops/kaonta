// These checks support the classroom demo. A real backend must enforce them too.
export function canReview(user, type, target) {
  if (!user || user.role !== 'customer' || !target || target.email !== user.email) return false;
  if (type === 'booking') return target.status === 'Completed';
  if (type === 'order') return !target.cancelled && target.step === 4;
  return false;
}

export function validateReviewInput(data, isDelivery) {
  const rating = Number(data.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'Choose an overall rating from 1 to 5 stars.';
  const comment = String(data.comment || '').trim();
  if (!comment || comment.length > 500) return 'Write a comment between 1 and 500 characters.';
  if (isDelivery && data.deliveryRating !== '' && data.deliveryRating != null) {
    const delivery = Number(data.deliveryRating);
    if (!Number.isInteger(delivery) || delivery < 1 || delivery > 5) return 'Choose a delivery rating from 1 to 5, or leave it blank.';
  }
  return '';
}
