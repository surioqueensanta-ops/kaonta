import React, { useLayoutEffect, useRef, useState } from 'react';
import './FixedNavigation.css';

export default function FixedNavigation({ children }) {
  const navigationRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const navigation = navigationRef.current;
    const measure = () => setHeight(Math.ceil(navigation.getBoundingClientRect().height));
    measure();
    // Recalculate when the mobile layout wraps or an admin link appears.
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(navigation);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return <>
    <div className="fixed-navigation" ref={navigationRef}>{children}</div>
    <div className="navigation-spacer" style={{ height }} aria-hidden="true" />
  </>;
}
