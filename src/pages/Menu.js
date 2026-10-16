import React from 'react';
import { categories } from '../data/restaurantData';
import FoodCard from '../components/FoodCard';
import PageHeading from '../components/PageHeading';
import './Menu.css';

// Edit this screen's HTML-like JSX below. Shared state arrives through props.
export default function Menu({
  add,
  category,
  query,
  setCategory,
  setQuery,
  shownMenu
}) {
  return <section className="section-wrap menu-page">
    <PageHeading eyebrow="THE KAONHUB KITCHEN" title="What are you craving?">Familiar Filipino flavors, made for your kind of day. All prices are sample prices in Philippine pesos.</PageHeading>
    <div className="menu-toolbar">
      <div className="category-list" aria-label="Food categories">
        {categories.map(c => <button aria-pressed={category === c} key={c} className={category === c ? 'chip selected' : 'chip'} onClick={() => setCategory(c)}>
          {c}
        </button>)}
      </div>
      <label className="search-box">
        <span className="sr-only">Search dishes</span>
        <input type="search" placeholder="Search your favorites…" value={query} onChange={e => setQuery(e.target.value)} />
        <span aria-hidden="true">⌕</span>
      </label>
    </div>
    <p className="results-count">{shownMenu.length} dishes to make your day</p>
    <div className="food-grid">
      {shownMenu.map(item => <FoodCard key={item.id} item={item} onAdd={add} />)}
    </div>
    {!shownMenu.length && <div className="empty-state">
      <h2>No dishes found.</h2>
      <p>Try another name or choose a different category.</p>
      <button className="secondary" onClick={() => {
        setQuery('');
        setCategory('All dishes');
      }}>Show all dishes</button>
    </div>}
  </section>;
}
