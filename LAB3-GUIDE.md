# KaonHub / Lab 3

Your Create React App project folder is `surio.2.0`. The website is called KaonHub. No Vite migration or additional package installation is required.

## Run in CMD

```cmd
cd /d "C:\Users\Queensanta Surio\surio.2.0"
npm start
```

If it is already running, save the updated code and refresh the existing browser tab.

## Sample accounts

Customer email: `customer@kaonhub.demo` / password: `Demo123!`

Admin email: `admin@kaonhub.demo` / password: `Admin123!`

Sign up creates a customer only. Accounts, cart, menu changes, bookings and orders stay in React memory for this browser session. Refreshing the page resets everything. Logging out does not refresh the page, so you can demonstrate customer requests followed by admin updates.

## Presentation walkthrough

1. Browse the home page, open Our menu, search and filter food.
2. Add food, change cart quantities and switch between delivery and pickup to demonstrate derived totals.
3. Log in as a customer and reserve a future two-hour table slot. Optionally include the cart as a food preorder. Show the Pending status.
4. Place a delivery order. Central zone costs PHP 50, Nearby zone costs PHP 80. Outside service area is rejected. These are classroom sample zones, not a real restaurant's coverage.
5. Log out and log in as admin. Confirm the reservation, advance the food order through its statuses, and toggle dish availability or add a dish.
6. Log out and log in as the same customer. Check My activity to see the updated statuses. Cancel a future reservation if desired.

## React concepts you can explain

`App.js` coordinates shared state and navigation. Screens and their CSS are in `src/pages`. Shared components are in `src/components`; menu data is in `src/data/restaurantData.js`. FoodCard receives item and onAdd as props. useState stores the active screen, account, menu, cart, reservations and orders. onClick/onChange/onSubmit update that state. map renders lists with stable keys. Conditional rendering changes the view, shows admin-only navigation and displays an address for delivery. The subtotal is derived with reduce instead of duplicated in state. FormData reads submitted form fields.

The Add to order button is JSX in FoodCard; its appearance comes from App.css and its click calls the onAdd prop. App's add function updates the cart, and React renders the new item count.

## Honest limits

This is a local front-end lab prototype, not a production service. Account/password comparison happens in browser memory for demonstration only. Do not enter real passwords or personal details. Real authentication, secure password hashing, session cookies and role authorization must be implemented on a backend. Hiding Admin navigation is not a security boundary.

There is no database, actual notification, online payment, live rider map or real delivery. Order progress is changed manually by admin. Each exact time slot has five sample tables for up to six guests each. Booking checks run only in this session; a backend must recheck and reserve capacity atomically for concurrent users. Admin can mark bookings Completed manually for demonstration. Sample seats and dish availability are not linked to a real restaurant.

Suggested Lab 3 evidence: menu/search results, changed cart total, pending reservation, confirmed reservation, customer order tracking, admin dashboard and relevant source snippets. Confirm the instructor's required upload format.
