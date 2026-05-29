'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', text: 'All fields are required.' });
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStatus({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
      setFormData({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <div className="contact-container container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="gradient-text">Contact Admissions</span></h1>
        <p className="page-subtitle">Have questions about the seat matrix or registration deadline? Drop us a note.</p>
      </div>

      <div className="contact-grid grid-cols-2">
        {/* Contact Form */}
        <div className="contact-form-card glass-card">
          <h2>Send us a Message</h2>
          {status.text && (
            <div className={`status-alert badge-${status.type === 'success' ? 'success' : 'danger'}`} style={{ padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'block', textTransform: 'none' }}>
              {status.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-name">Full Name</label>
              <input
                type="text"
                id="contact-name"
                className="form-control"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="contact-email">Email Address</label>
              <input
                type="email"
                id="contact-email"
                className="form-control"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                className="form-control"
                rows="5"
                placeholder="Type your query here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Office details */}
        <div className="office-card glass-card">
          <h2>CounselSphere Head Office</h2>
          <div className="office-info">
            <div className="info-block">
              <h3>Office Address</h3>
              <p>Admission Block, Main Campus</p>
              <p>University Avenue Road, Suite 405</p>
              <p>New Delhi, DL 110001</p>
            </div>

            <div className="info-block">
              <h3>Direct Helpline</h3>
              <p>Admissions Office: +1 (555) 019-2834</p>
              <p>Support (9 AM - 6 PM IST): +1 (555) 019-9988</p>
            </div>

            <div className="info-block">
              <h3>Email Enquiries</h3>
              <p>General admissions: admissions@counselsphere.edu</p>
              <p>Portal Tech Support: portal-dev@counselsphere.edu</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-container {
          padding: 60px 20px 80px 20px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .contact-form-card, .office-card {
          padding: 40px;
        }
        .contact-form-card h2, .office-card h2 {
          font-size: 1.6rem;
          margin-bottom: 24px;
          color: var(--primary);
        }
        .office-info {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .info-block h3 {
          font-size: 1.1rem;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .info-block p {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
