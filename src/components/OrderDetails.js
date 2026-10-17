import React, { useEffect, useRef } from 'react';
import { peso, stepsFor } from '../utils/formatters';
import './OrderDetails.css';

export default function OrderDetails({ order, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!order) return;
    const element = ref.current;
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = overflow; if (opener?.isConnected) opener.focus({ preventScroll: true }); };
  }, [order]);
  if (!order) return null;
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <dialog ref={ref} className="order-details" aria-labelledby="order-details-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>
    <button className="secondary order-details-close" autoFocus onClick={onClose} aria-label="Close order details">Close ×</button>
    <span className="eyebrow">{order.service} · {order.cancelled ? 'Declined' : stepsFor(order.service)[order.step]}</span>
    <h2 id="order-details-title">Order details</h2><p className="record-id">{order.id}</p>
    {order.createdAt && <p>Placed {new Date(order.createdAt).toLocaleString('en-PH')}</p>}
    <dl><dt>Customer</dt><dd>{order.name}</dd><dt>Email</dt><dd>{order.email}</dd><dt>Contact number</dt><dd>{order.phone || 'Not provided'}</dd>
      {order.service === 'Delivery' && <><dt>Delivery address</dt><dd>{order.address || 'Not provided'} · {order.zone}</dd></>}
      <dt>Customer notes</dt><dd>{order.notes || 'No special instructions.'}</dd></dl>
    <h3>Ordered items</h3><ul className="order-details-items">{order.items.map(item => <li key={item.id}>
      {item.image && <img src={item.image} alt="" />}<span><strong>{item.name}</strong><small>{item.quantity} × {peso(item.price)}</small></span><strong>{peso(item.quantity * item.price)}</strong>
    </li>)}</ul>
    <div className="order-details-totals"><p><span>Food subtotal</span><strong>{peso(subtotal)}</strong></p>
      {order.service === 'Delivery' && <p><span>Delivery fee</span><strong>{peso(order.total - subtotal)}</strong></p>}
      <p><span>Order total</span><strong>{peso(order.total)}</strong></p></div>
    <small>Payment is not verified in this classroom prototype.</small>
  </dialog>;
}
