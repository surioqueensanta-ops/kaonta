import React from 'react';
import { peso } from '../utils/formatters';
import './FoodCard.css';
export default function FoodCard({
  item,
  onAdd
}) {
  return <article className="food-card">
    <div className={`dish-art ${item.color}`}>
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
    </div>
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
        <button className="add-button" disabled={!item.available} onClick={() => onAdd(item.id)} aria-label={`Add ${item.name} to order`}>
          {item.available ? 'Add to order +' : 'Sold out'}
        </button>
      </div>
    </div>
  </article>;
}
