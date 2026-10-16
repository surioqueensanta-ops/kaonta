import React from 'react';

export default function PageHeading({
  eyebrow,
  title,
  children
}) {
  return <div className="page-heading">
    <span className="eyebrow">
      {eyebrow}
    </span>
    <h1>
      {title}
    </h1>
    {children && <p>
      {children}
    </p>}
  </div>;
}
