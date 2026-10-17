import { canReview, validateReviewInput } from './reviewRules';

const user = { role: 'customer', email: 'customer@kaonhub.demo' };
test('only the customer who completed the activity can review it', () => {
  expect(canReview(user, 'booking', { email: user.email, status: 'Completed' })).toBe(true);
  expect(canReview(user, 'booking', { email: user.email, status: 'Confirmed' })).toBe(false);
  expect(canReview(user, 'order', { email: user.email, step: 4, cancelled: false })).toBe(true);
  expect(canReview(user, 'order', { email: user.email, step: 3, cancelled: false })).toBe(false);
  expect(canReview(user, 'order', { email: user.email, step: 4, cancelled: true })).toBe(false);
  expect(canReview(user, 'order', { email: 'someone-else@example.com', step: 4 })).toBe(false);
  expect(canReview({ ...user, role: 'admin' }, 'order', { email: user.email, step: 4 })).toBe(false);
});
test('reviews require valid stars and a nonblank bounded comment', () => {
  expect(validateReviewInput({ rating: 5, comment: 'Lovely food.', deliveryRating: '' }, true)).toBe('');
  expect(validateReviewInput({ rating: 0, comment: 'Food' }, false)).not.toBe('');
  expect(validateReviewInput({ rating: 4, comment: '  ' }, false)).not.toBe('');
  expect(validateReviewInput({ rating: 4, comment: 'a'.repeat(501) }, false)).not.toBe('');
  expect(validateReviewInput({ rating: 3, comment: 'Good', deliveryRating: 6 }, true)).not.toBe('');
});
