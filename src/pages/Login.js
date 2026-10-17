import React from 'react';

import './Login.css';

// Edit this screen's HTML-like JSX below. Shared state arrives through props.
export default function Login({
  authMode,
  authenticate,
  setAuthMode,
  setNotice
}) {
  return <section className="auth-layout">
    <div className="auth-story">
      <span className="eyebrow">A SEAT AT OUR TABLE</span>
      <h1>Good things<br />start with<br /><em>“kaon ta.”</em></h1>
      <p>Your favorites, reservations, and next great meal, all in one place.</p>
      <div className="auth-art" aria-hidden="true">🍽️</div>
    </div>
    <div className="auth-form-wrap">
      <div className="auth-tabs">
        <button className={authMode === 'login' ? 'selected' : ''} onClick={() => {
          setAuthMode('login');
          setNotice('');
        }}>Log in</button>
        <button className={authMode === 'signup' ? 'selected' : ''} onClick={() => {
          setAuthMode('signup');
          setNotice('');
        }}>Sign up</button>
      </div>
      <h2>
        {authMode === 'login' ? 'Welcome back.' : 'Join the table.'}
      </h2>
      <p>
        {authMode === 'login' ? 'Your next meal is just a few clicks away.' : 'Create a customer account for this demo session.'}
      </p>
      <form key={authMode} onSubmit={authenticate}>
        {authMode === 'signup' && <>
          <label>Full name<input name="name" autoComplete="name" required maxLength={70} /></label>
          <label>Contact number<input name="phone" type="tel" autoComplete="tel" required pattern="[0-9+ ()-]{7,20}" /></label>
        </>}
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={120} /></label>
        <label>Password<input name="password" type="password" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} required minLength={8} /></label>
        {authMode === 'signup' && <label>Confirm password<input name="confirm" type="password" autoComplete="new-password" required minLength={8} /></label>}
        <button className="primary full-width">
          {authMode === 'login' ? 'Log in' : 'Create Account'}
        </button>
      </form>
    </div>
  </section>;
}
