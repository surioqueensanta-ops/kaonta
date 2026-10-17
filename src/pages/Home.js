import React from 'react';
import FoodCard from '../components/FoodCard';
import './Home.css';

// Edit this screen's HTML-like JSX below. Shared state arrives through props.
export default function Home({
  add,
  onView,
  go,
  menu,
  requireLogin,
  setService
}) {
  return <>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow"><span className="tiny-dot" /> A LITTLE TASTE OF HOME</span>
        <h1>Your favorites.<br />Your people.<br /><em>Your table.</em></h1>
        <p>Make room for good food and even better company. Reserve a seat, order ahead, or let us bring your favorites to you.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => requireLogin('reserve')}>Reserve a table <span>↗</span></button>
          <button className="secondary" onClick={() => { setService('Delivery'); go('menu'); }}>Order delivery</button>
          <button className="secondary" onClick={() => { setService('Pickup'); go('menu'); }}>Order pickup</button>
        </div>
        <div className="hero-footnote">
          <span className="mini-faces" aria-hidden="true">☺ ☺ ☺</span>
          <span>Made for family lunches,<br /><strong>catch-ups, and everything in between.</strong></span>
        </div>
      </div>
      <div className="hero-visual">
        <span className="orbit-label">FRESHLY MADE · FILIPINO FAVORITES ·</span>
        <img className="hero-meal-photo" src="/images/menu/chicken-adobo.png"
          alt="Chicken adobo served over rice with spring onions"
          width="500" height="500" loading="eager" decoding="async" />
        <span className="visual-star" aria-hidden="true">✳</span>
        <div className="floating-note">
          <span>🍃</span>
          <div>Good food. No rush.<small>We’ll save you a seat.</small></div>
        </div>
        <span className="hero-caption">KAON NA! / LET’S EAT.</span>
      </div>
    </section>
    <section className="service-ribbon" aria-label="Our services">
      <div>
        <span>01</span>
        <strong>Book your spot</strong>
        <p>A table, ready for your plans.</p>
      </div>
      <div>
        <span>02</span>
        <strong>Skip the wait</strong>
        <p>Preorder your favorites.</p>
      </div>
      <div>
        <span>03</span>
        <strong>Stay right there</strong>
        <p>Pickup or doorstep delivery.</p>
      </div>
    </section>
    <section className="section-wrap">
      <div className="section-top">
        <div>
          <span className="eyebrow">THERE’S SOMETHING FOR EVERYONE</span>
          <h2>A few crowd favorites.</h2>
        </div>
        <button className="text-button" onClick={() => go('menu')}>See full menu →</button>
      </div>
      <div className="food-grid">
        {menu.slice(0, 3).map(item => <FoodCard key={item.id} item={item} onView={onView} onAdd={add} />)}
      </div>
    </section>
    <section className="reservation-banner">
      <div>
        <span className="eyebrow">SAVE A SEAT FOR SOMETHING GOOD</span>
        <h2>Your next gathering starts here.</h2>
        <p>A quiet date, a family meal, or a long-overdue catch-up.</p>
      </div>
      <button className="primary light" onClick={() => requireLogin('reserve')}>Reserve a table ↗</button>
    </section>
  </>;
}
