'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createReview, DEMO_STORAGE_KEY, parseDemoState } from '../../../lib/demo-model.mjs';

export default function EmployeeReviewPage({ token }) {
  const [resolvedToken, setResolvedToken] = useState(token);
  const [state, setState] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const queryToken = new URLSearchParams(window.location.search).get('employee');
    if (queryToken) setResolvedToken(queryToken);
    setState(parseDemoState(window.localStorage.getItem(DEMO_STORAGE_KEY)));
  }, []);

  if (!state) return <main className="customer-shell"><p>Loading review page...</p></main>;
  const employee = state.employees.find((item) => item.token === resolvedToken && item.active);

  function submitReview(event) {
    event.preventDefault();
    const result = createReview({ token: resolvedToken, rating, feedback });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const nextState = { ...state, reviews: [...state.reviews, result.value] };
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(nextState));
    window.dispatchEvent(new Event('demo-state-changed'));
    setState(nextState);
    setSubmitted(true);
    setError('');
  }

  if (!employee) {
    return (
      <main className="customer-shell">
        <section className="customer-card"><span className="brand-mark" aria-hidden="true">✳</span><h1>This review link is unavailable.</h1><p>The employee may be inactive, or the demo may have been reset.</p><Link className="button" href="/demo">Return to owner demo</Link></section>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="customer-shell">
        <section className="customer-card success-card"><span className="success-mark" aria-hidden="true">✓</span><p className="eyebrow">FEEDBACK RECEIVED</p><h1>Thank you.</h1><p>Your feedback for {employee.name} has been saved in this browser's local demonstration.</p><Link className="button" href="/demo">View it in the owner workspace</Link><button className="text-button" type="button" onClick={() => { setSubmitted(false); setRating(0); setFeedback(''); }}>Submit another review</button></section>
      </main>
    );
  }

  return (
    <main className="customer-shell">
      <section className="customer-card">
        <div className="customer-brand"><span className="brand-mark" aria-hidden="true">✳</span><span>{state.company.name}</span></div>
        <span className="employee-initial large-initial" aria-hidden="true">{employee.name.charAt(0).toUpperCase()}</span>
        <p className="eyebrow">PRIVATE CUSTOMER FEEDBACK</p>
        <h1>How was your experience with {employee.name}?</h1>
        <p>Your feedback goes to {state.company.name}. It is not posted publicly.</p>
        <form className="review-form" onSubmit={submitReview}>
          <fieldset><legend>Overall rating</legend><div className="rating-input" role="radiogroup" aria-label="Overall rating">{[1, 2, 3, 4, 5].map((value) => <button className={value <= rating ? 'star selected' : 'star'} type="button" key={value} onClick={() => setRating(value)} aria-label={`${value} star${value === 1 ? '' : 's'}`} aria-pressed={rating === value}>★</button>)}</div><span className="rating-label">{rating ? `${rating} out of 5` : 'Select a rating'}</span></fieldset>
          <label htmlFor="feedback">Tell us what happened</label>
          <textarea id="feedback" value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder={`What did ${employee.name} do well? What could be better?`} rows={6} maxLength={5000} />
          <span className="character-count">{feedback.length} / 5,000</span>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button full-button" type="submit">Send private feedback</button>
        </form>
        <p className="demo-footnote">Demo only: this submission is stored in your browser, not sent to a live company account.</p>
      </section>
    </main>
  );
}
