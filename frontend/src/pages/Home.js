import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="hero-content">
                <div className="hero-badge">
                  <span>🔬</span> International Conference on AI 2026
                </div>
                <h1 className="hero-title">
                  Advancing Research with{' '}
                  <span className="gradient-text">Intelligent Systems</span>
                </h1>
                <p className="hero-subtitle">
                  Submit your research abstracts and receive AI-powered session recommendations. 
                  Experience the future of academic conference management.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/submit" className="hero-cta">
                    Submit Abstract →
                  </Link>
                  <Link to="/admin" className="hero-cta-secondary">
                    View Dashboard
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-flex justify-content-center">
              <div className="glass-card p-4" style={{ maxWidth: '320px' }}>
                <div className="text-center">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
                  <h5 style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>AI-Powered Analysis</h5>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    Upload your abstract and let our AI recommend the perfect session track.
                  </p>
                  <div style={{ background: 'rgba(16,185,129,0.15)', borderRadius: '8px', padding: '0.6rem 1rem', display: 'inline-block' }}>
                    <span style={{ color: '#6ee7b7', fontSize: '0.85rem', fontWeight: 500 }}>✓ Session: Machine Learning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="text-center">
            <p className="section-label">Why Choose ICAI 2026</p>
            <h2 className="section-title">Intelligent Conference Experience</h2>
            <p className="section-subtitle">
              Our platform combines cutting-edge AI with seamless submission management.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon feature-icon-blue">🤖</div>
                <h5>AI Session Recommendation</h5>
                <p>
                  Our AI analyzes your abstract content and automatically suggests the most relevant conference session track.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon feature-icon-violet">📄</div>
                <h5>Smart Abstract Analysis</h5>
                <p>
                  Upload PDF or DOCX files and get instant AI-powered content analysis with intelligent categorization.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon feature-icon-emerald">🎯</div>
                <h5>Streamlined Submission</h5>
                <p>
                  Complete your submission in minutes with our intuitive form, real-time validation, and guided workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container">
          <p className="mb-0">© 2026 International Conference on Artificial Intelligence. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
