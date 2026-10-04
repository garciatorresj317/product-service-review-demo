import Link from 'next/link';

const steps = [
  ['01', 'Give each employee a unique link', 'Your business adds an employee and receives a review URL associated with that employee and your company.'],
  ['02', 'Make feedback easy to leave', 'Customers open the link with an NFC card, QR code, or direct link, then leave a rating and written feedback without creating an account.'],
  ['03', 'Understand feedback privately', 'Authorized owners and managers view feedback in a private company dashboard, with each review linked to the correct employee.'],
];

export default function Home() {
  return (
    <>
      <header className="header">
        <Link className="brand" href="/" aria-label="Product & Service Review home"><span className="brand-mark" aria-hidden="true">✳</span> Product &amp; Service Review</Link>
        <div className="header-actions"><a className="nav-link" href="#how-it-works">How it works <span aria-hidden="true">↓</span></a><Link className="nav-demo-link" href="/demo">Try demo</Link></div>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="dot" /> Customer feedback. For your business.</p>
            <h1 id="hero-title">Better service<br />starts with <em>listening.</em></h1>
            <p className="intro">A simple way for businesses to collect customer feedback about individual employees, recognize great service, and understand where to improve.</p>
            <div className="hero-actions"><Link className="button" href="/demo">Try the interactive demo <span aria-hidden="true">→</span></Link><a className="secondary-link" href="#how-it-works">See how it works</a></div>
            <p className="build-note">The interactive demo lets you add an employee, open their customer link, submit a review, and see it in the owner workspace. Demo data stays in this browser.</p>
          </div>
          <aside className="preview" aria-label="Illustration of the employee feedback workflow">
            <div className="preview-top"><span className="eyebrow">One link. The right employee.</span><span className="sample">Try it live</span></div>
            <div className="employee-illustration" aria-hidden="true"><span className="employee-avatar">J</span><span className="connection-label">NFC card · QR code · Direct link</span></div>
            <div className="review-card">
              <span className="category">JOHN AT SAMPLE COMPANY</span>
              <h2>How was your experience with John?</h2>
              <p>Open the working demo to select a rating, write feedback, and watch it appear in the owner workspace.</p>
              <div className="workflow-note"><strong>Customer opens employee link</strong><span aria-hidden="true">↓</span><strong>Feedback appears for the company</strong></div>
              <div className="review-footer"><span className="avatar" aria-hidden="true">J</span><span>Private by design<br /><small>For authorized company owners and managers</small></span></div>
              <Link className="card-link" href="/review/john-sample-company">Open John's demo review page →</Link>
            </div>
          </aside>
        </section>
        <section id="how-it-works" className="how" aria-labelledby="how-title"><div className="section-heading"><p className="eyebrow">HOW IT WORKS</p><h2 id="how-title">A tap. A review. A clearer picture.</h2><p>The same employee review URL works with NFC cards, QR codes, and direct links. No NFC hardware is required.</p></div><div className="steps">{steps.map(([number, title, description]) => <article key={number}><span className="step-number">{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
        <section className="try-section"><div><p className="eyebrow">READY TO TRY IT?</p><h2>Run the workflow yourself.</h2><p>Start in the owner workspace, open John's customer link, leave feedback, and return to see the saved review.</p></div><Link className="button" href="/demo">Launch interactive demo <span aria-hidden="true">→</span></Link></section>
        <section className="principle"><span aria-hidden="true">✳</span><div><h2>Built for private, useful feedback.</h2><p>Production reviews are intended for your company's authorized owners and managers. The current interactive demonstration stores its test data only in your browser.</p></div></section>
      </main>
      <footer><span>Product &amp; Service Review</span><span>Listen better. Serve better.</span></footer>
    </>
  );
}
