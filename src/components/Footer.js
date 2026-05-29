export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand-section">
            <h3 className="footer-logo"><span className="gradient-text">CounselSphere</span></h3>
            <p className="footer-desc">
              Your gateway to academic excellence. Direct seat allotment, preference tracking, and online verifications.
            </p>
          </div>
          
          <div className="footer-links-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/admin-portal/login">Admin Desk</a></li>
            </ul>
          </div>
          
          <div className="footer-contact-section">
            <h4 className="footer-heading">Admissions Desk</h4>
            <p className="contact-text">📍 Central Campus, Admission Block, Room 102</p>
            <p className="contact-text">📞 +1 (555) 019-2834</p>
            <p className="contact-text">✉️ admissions@counselsphere.edu</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CounselSphere Admissions. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          padding: 60px 0 30px 0;
          margin-top: auto;
        }
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .footer-logo {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 16px;
        }
        .footer-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          max-width: 320px;
          line-height: 1.6;
        }
        .footer-heading {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links a {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .footer-links a:hover {
          color: var(--primary);
          padding-left: 4px;
        }
        .contact-text {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-bottom {
          border-top: 1px solid var(--border-color);
          padding-top: 30px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .footer {
            padding: 40px 0 20px 0;
          }
        }
      `}</style>
    </footer>
  );
}
