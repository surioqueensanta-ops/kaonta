import React, { useEffect, useRef, useState } from 'react';
import { peso } from '../utils/formatters';
import './FoodCard.css';
export default function FoodCard({
  item,
  onAdd,
  onView
}) {
  const [added, setAdded] = useState(false);
  const feedbackTimer = useRef(null);
  useEffect(() => () => clearTimeout(feedbackTimer.current), []);

  function handleAdd() {
    if (onAdd(item.id) === false) return;
    setAdded(true);
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setAdded(false), 1400);
  }

  return <article className="food-card">
    <button type="button" className={`dish-art food-preview ${item.color}`} onClick={() => onView(item.id)} aria-label={`View ${item.name} details`}>
      <span className="dish-tag">
        {item.tag}
      </span>
      {item.image ? (
        <img className="dish-photo" src={item.image} alt={item.name}
          loading="lazy" decoding="async"
          style={{ objectPosition: item.imagePosition || 'center' }} />
      ) : (
        <div className="dish-plate" aria-hidden="true">{item.emoji}</div>
      )}
    </button>
    <div className="dish-copy">
      <div className="dish-title">
        <h3>
          {item.name}
        </h3>
        <strong>
          {peso(item.price)}
        </strong>
      </div>
      <p>
        {item.note}
      </p>
      <div className="dish-bottom">
        <span>
          {item.category}
        </span>
        <button className={added ? 'add-button is-added' : 'add-button'} disabled={!item.available} onClick={handleAdd} aria-label={`Add ${item.name} to order`}>
          {!item.available ? 'Sold out' : added ? 'Added ✓' : 'Add to order +'}
        </button>
      </div>
    </div>
  </article>;
}
