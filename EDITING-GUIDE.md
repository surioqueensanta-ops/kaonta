# Editing KaonHub

Open `C:\Users\Queensanta Surio\surio.2.0` in VS Code.

Each screen has a JavaScript component for its HTML-like JSX and a CSS file for its specific design:

| Screen | JSX and JavaScript | Screen styling |
| --- | --- | --- |
| Home | src/pages/Home.js | src/pages/Home.css |
| Menu | src/pages/Menu.js | src/pages/Menu.css |
| Login and sign-up | src/pages/Login.js | src/pages/Login.css |
| Table reservation | src/pages/Reservation.js | src/pages/Reservation.css |
| Cart, delivery and pickup | src/pages/Checkout.js | src/pages/Checkout.css |
| Customer orders and bookings | src/pages/CustomerDashboard.js | src/pages/CustomerDashboard.css |
| Admin dashboard | src/pages/AdminDashboard.js | src/pages/AdminDashboard.css |

Shared site colors, navigation, buttons, forms and cards remain in `src/App.css`. The reusable logo, food cards, headings and status badges are in `src/components`. Sample dishes, menu categories, booking times and demo accounts are in `src/data/restaurantData.js`. Price, date and order-status helpers are in `src/utils/formatters.js`.

`src/App.js` manages shared state, login, cart actions, reservation/order submission and screen navigation. Pages receive the data and handlers they need as props. This preserves the same state as you navigate between screens.

## Example edits

- Change the home-page headline: edit the h1 in Home.js.
- Change the hero background or illustrated meal: edit Home.css.
- Change a dish name or sample price: edit restaurantData.js.
- Change the admin headings or buttons: edit AdminDashboard.js.
- Change admin metrics styling: edit AdminDashboard.css.
- Change button colors site-wide: edit the variables and .primary rule in App.css.

Use Ctrl+S to save. If the development server is running, the browser updates automatically. In CMD, start it with:

```cmd
cd /d "C:\Users\Queensanta Surio\surio.2.0"
npm start
```

Edit src files, not the generated build folder. JSX uses className instead of class and onClick for button events. It does not need DOCTYPE, html, head or body tags inside each page component. Those belong to the public/index.html template.

The app remains a front-end classroom demo: data and demo accounts reset on refresh, admin controls are not server-authorized, and no actual payments or deliveries are performed.
