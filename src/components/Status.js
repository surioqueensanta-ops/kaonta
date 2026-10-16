import React from 'react';

export default function Status({
  children
}) {
  return <span className={`status status-${String(children).toLowerCase().replaceAll(' ', '-')}`}>
    {children}
  </span>;
}
