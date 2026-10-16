// Shared price, date, time and order-status helpers.
export const peso = number => new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP'
}).format(number);

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function newId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function stepsFor(service) {
  return service === 'Delivery' ? ['Pending', 'Confirmed', 'Preparing', 'Out for delivery', 'Delivered'] : ['Pending', 'Confirmed', 'Preparing', 'Ready for pickup', 'Collected'];
}

export function niceDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function niceTime(time) {
  const [h, m] = time.split(':');
  return `${Number(h) % 12 || 12}:${m} ${Number(h) >= 12 ? 'PM' : 'AM'}`;
}
