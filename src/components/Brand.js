import React from 'react';

export default function Brand({
  onClick
}) {
  return <button className="brand" onClick={onClick} aria-label="KaonHub home">
    <span className="brand-symbol" aria-hidden="true">k.</span>
    <span>Kaon<span className="brand-accent">Hub</span><small>GOOD FOOD, GOOD COMPANY</small></span>
  </button>;
}
