export const tables = [
  { id: 'T1', name: 'Table 1', seats: 2, location: 'Window seat', area: 'Indoor' },
  { id: 'T2', name: 'Table 2', seats: 2, location: 'Quiet corner', area: 'Indoor' },
  { id: 'T3', name: 'Table 3', seats: 4, location: 'Window seat', area: 'Indoor' },
  { id: 'T4', name: 'Table 4', seats: 6, location: 'Family seating', area: 'Indoor' },
  { id: 'T5', name: 'Table 5', seats: 6, location: 'Garden seating', area: 'Outdoor' }
];
export function tableAvailable(table, bookings, date, time, guests) {
  const start = new Date(date + 'T' + time).getTime();
  if (!Number.isFinite(start) || start <= Date.now() || !Number.isInteger(Number(guests)) || guests < 1 || guests > table.seats) return false;
  return !bookings.some(booking => {
    if (['Cancelled', 'Declined', 'Completed'].includes(booking.status)) return false;
    if (booking.tableId && booking.tableId !== table.id) return false;
    const bookedStart = new Date(booking.date + 'T' + booking.time).getTime();
    return start < bookedStart + 120 * 60000 && bookedStart < start + 120 * 60000;
  });
}
