import { tables, tableAvailable } from './tables';
const date = '2099-01-01';
test('table capacity, overlapping intervals, cancellation and table identity', () => {
 const booking = { tableId:'T1', date, time:'13:00', status:'Pending' };
 expect(tableAvailable(tables[0], [], date, '13:00', 3)).toBe(false);
 expect(tableAvailable(tables[0], [booking], date, '14:00', 2)).toBe(false);
 expect(tableAvailable(tables[0], [booking], date, '15:00', 2)).toBe(true);
 expect(tableAvailable(tables[1], [booking], date, '13:00', 2)).toBe(true);
 expect(tableAvailable(tables[0], [{ ...booking, status:'Cancelled' }], date, '13:00', 2)).toBe(true);
 expect(tableAvailable(tables[0], [{ ...booking, status:'Confirmed' }], date, '12:00', 2)).toBe(false);
 expect(tableAvailable(tables[0], [], '2000-01-01', '13:00', 2)).toBe(false);
});
