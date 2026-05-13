import Link from 'next/link';

export default function Home() {
  return (
    <>
      <header>
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">🤖 Social Media Agent</Link>
            <nav>
              <Link href="#features">Features</Link>
              <Link href="#pricing">Pricing</Link>
            </nav>
            <Link href="/login" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-tag">⚡ AI-Powered Social Media</div>
            <h1>30 Days of <span>Social Posts</span><br />in 2 Minutes</h1>
            <p className="hero-desc">
              Stop wasting hours on content creation. Our AI agent generates a complete month of 
              professional, on-brand social media posts instantly. Ready to post.
            </p>
            <div className="hero-cta">
              <Link href="/login" className="btn btn-primary">Start Free Trial</Link>
              <Link href="#features" className="btn" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>How It Works</Link>
            </div>
            
            <div className="stats">
              <div className="stat">
                <div className="stat-number">30</div>
                <div className="stat-label">Unique Posts</div>
              </div>
              <div className="stat">
                <div className="stat-number">2 min</div>
                <div className="stat-label">Setup Time</div>
              </div>
              <div className="stat">
                <div className="stat-number">100%</div>
                <div className="stat-label">Customizable</div>
              </div>
              <div className="stat">
                <div className="stat-number">₹999</div>
                <div className="stat-label">Per Month</div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '15px' }}>How It Works</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted)', maxWidth: '500px', margin: '0 auto' }}>
              Three simple steps to automated content success
            </p>
          </div>
          
          <div className="features">
            <div className="feature">
              <div className="feature-icon">📋</div>
              <h3>1. Tell Us About Your Business</h3>
              <p>Fill out a quick form: industry, target audience, brand tone, and key topics. Takes 2 minutes.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🤖</div>
              <h3>2. AI Generates Your Content</h3>
              <p>Our Claude-powered agent creates 30 unique, varied posts with captions, hashtags, and CTAs.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📱</div>
              <h3>3. Download & Share</h3>
              <p>Get a beautiful response ready to copy-paste directly to Instagram, LinkedIn, or any scheduler.</p>
            </div>
          </div>
        </section>

        <section id="pricing" className="pricing">
          <div className="container">
            <h2>Simple, Transparent Pricing</h2>
            <p className="pricing-desc">
              One flat rate. No hidden fees. Cancel anytime.
            </p>
            
            <div className="price-card">
              <h3 style={{ fontSize: '1.5rem' }}>Monthly Plan</h3>
              <div className="price">₹999</div>
              <p className="price-desc">/month • unlimited clients</p>
              
              <ul className="price-features">
                <li>Unlimited 30-day content calendars</li>
                <li>Multiple social platforms (IG, LinkedIn, Twitter)</li>
                <li>Custom brand voice & tone</li>
                <li>Revisions included</li>
                <li>Priority support</li>
              </ul>
              
              <Link href="/login" className="btn btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center' }}>Subscribe Now</Link>
            </div>
          </div>
        </section>

        <section className="cta-section container">
          <h2>Ready to 10x Your Client&apos;s Social Presence?</h2>
          <p>Join other agencies and freelancers already using the Social Media Agent to deliver better results faster.</p>
          <Link href="/login" className="btn btn-primary">Get Started - ₹999/month</Link>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2026 Social Media Agent. Built for creators, by creators.</p>
        </div>
      </footer>
    </>
  );
}
