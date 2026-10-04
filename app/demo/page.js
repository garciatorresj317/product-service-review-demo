'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createEmployee,
  createInitialDemoState,
  DEMO_STORAGE_KEY,
  parseDemoState,
} from '../../lib/demo-model.mjs';

function readState() {
  return parseDemoState(window.localStorage.getItem(DEMO_STORAGE_KEY));
}

function writeState(nextState) {
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(nextState));
  window.dispatchEvent(new Event('demo-state-changed'));
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

export default function DemoDashboard() {
  const [state, setState] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const refresh = useCallback(() => setState(readState()), []);

  useEffect(() => {
    refresh();
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('demo-state-changed', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('demo-state-changed', refresh);
    };
  }, [refresh]);

  const reviewsByEmployee = useMemo(() => {
    const grouped = new Map();
    for (const review of state?.reviews ?? []) {
      grouped.set(review.employeeToken, [...(grouped.get(review.employeeToken) ?? []), review]);
    }
    return grouped;
  }, [state]);

  function addEmployee(event) {
    event.preventDefault();
    const result = createEmployee(name);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const nextState = { ...state, employees: [...state.employees, result.value] };
    writeState(nextState);
    setState(nextState);
    setName('');
    setError('');
  }

  function resetDemo() {
    const nextState = createInitialDemoState();
    writeState(nextState);
    setState(nextState);
    setCopied('');
  }

  function employeeReviewPath(employee) {
    if (process.env.NEXT_PUBLIC_BASE_PATH) {
      return `/review/john-sample-company?employee=${encodeURIComponent(employee.token)}`;
    }
    return `/review/${employee.token}`;
  }

  async function copyLink(employee) {
    const url = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${employeeReviewPath(employee)}`;
    await navigator.clipboard.writeText(url);
    setCopied(employee.token);
  }

  if (!state) return <main className="app-shell"><p>Loading demo...</p></main>;

  return (
    <>
      <header className="header app-header">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">✳</span> Product &amp; Service Review</Link>
        <button className="text-button" type="button" onClick={resetDemo}>Reset demo</button>
      </header>
      <main className="app-shell">
        <section className="demo-banner" aria-label="Demonstration notice">
          <strong>Interactive local demo</strong>
          <span>Try the full workflow now. Data stays in this browser and is not your production database.</span>
        </section>

        <div className="app-heading">
          <div>
            <p className="eyebrow">OWNER WORKSPACE</p>
            <h1>{state.company.name}</h1>
            <p>Add an employee, open their customer link, submit feedback, then return here to see it.</p>
          </div>
          <a className="button secondary-button" href="#add-employee">Add employee</a>
        </div>

        <section className="metric-grid" aria-label="Demo summary">
          <article><span>Employees</span><strong>{state.employees.length}</strong></article>
          <article><span>Reviews received</span><strong>{state.reviews.length}</strong></article>
          <article><span>Average rating</span><strong>{state.reviews.length ? (state.reviews.reduce((sum, review) => sum + review.rating, 0) / state.reviews.length).toFixed(1) : '—'}</strong></article>
        </section>

        <section className="workspace-grid">
          <div>
            <div className="section-title-row">
              <div><p className="eyebrow">EMPLOYEE LINKS</p><h2>Choose who the customer met</h2></div>
              <button className="text-button" type="button" onClick={refresh}>Refresh reviews</button>
            </div>
            <div className="employee-list">
              {state.employees.map((employee) => {
                const count = reviewsByEmployee.get(employee.token)?.length ?? 0;
                return (
                  <article className="employee-row" key={employee.id}>
                    <span className="employee-initial" aria-hidden="true">{employee.name.charAt(0).toUpperCase()}</span>
                    <div className="employee-details"><strong>{employee.name}</strong><span>{count} {count === 1 ? 'review' : 'reviews'} · Active</span></div>
                    <div className="employee-actions">
                      <Link className="small-button" href={employeeReviewPath(employee)}>Open review page</Link>
                      <button className="small-button ghost-button" type="button" onClick={() => copyLink(employee)}>{copied === employee.token ? 'Copied' : 'Copy link'}</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <form id="add-employee" className="panel form-panel" onSubmit={addEmployee}>
            <p className="eyebrow">ADD AN EMPLOYEE</p>
            <h2>Create another review link</h2>
            <label htmlFor="employee-name">Employee name</label>
            <input id="employee-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Maya" maxLength={120} />
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button full-button" type="submit">Add employee</button>
          </form>
        </section>

        <section className="reviews-section">
          <div className="section-title-row"><div><p className="eyebrow">PRIVATE FEEDBACK</p><h2>Recent reviews</h2></div></div>
          {state.reviews.length === 0 ? (
            <div className="empty-state"><strong>No feedback yet.</strong><p>Open John's review page above and submit the first test review. It will appear here.</p></div>
          ) : (
            <div className="review-list">
              {[...state.reviews].reverse().map((review) => {
                const employee = state.employees.find((item) => item.token === review.employeeToken);
                return (
                  <article className="feedback-card" key={review.id}>
                    <div><strong>{'★'.repeat(review.rating)}<span className="muted-stars">{'★'.repeat(5 - review.rating)}</span></strong><span>{formatDate(review.createdAt)}</span></div>
                    <p>“{review.feedback}”</p>
                    <small>Feedback for <strong>{employee?.name ?? 'Unknown employee'}</strong></small>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
