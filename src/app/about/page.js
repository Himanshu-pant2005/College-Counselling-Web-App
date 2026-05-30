'use client';
export default function AboutPage() {
  return (
    <div className="about-container container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title"><span className="gradient-text">About CounselSphere</span></h1>
        <p className="page-subtitle">Pioneering the future of educational guidance and smart admission systems.</p>
      </div>

      <div className="about-grid grid-cols-2">
        <div className="about-text-card glass-card">
          <h2>Our Vision</h2>
          <p>
            CounselSphere was established to modernize the college admission pipeline. By automating document verification, eligibility ranking, and seat allotment matrixes, we offer students an unbiased, direct entry pathway to higher education.
          </p>
          <p style={{ marginTop: '16px' }}>
            We believe that merit and transparency are the twin pillars of a successful admissions framework. Our digital portal bridges the gap between aspirants and administrative desks, ensuring zero paper trail delays and absolute accuracy.
          </p>
        </div>

        <div className="stats-card glass-card">
          <h2>At a Glance</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number gradient-text">6+</span>
              <span className="stat-label">Engineering Streams</span>
            </div>
            <div className="stat-item">
              <span className="stat-number gradient-text">360+</span>
              <span className="stat-label">Total Annual Intake</span>
            </div>
            <div className="stat-item">
              <span className="stat-number gradient-text">98%</span>
              <span className="stat-label">On-time Seat Allocations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number gradient-text">24/7</span>
              <span className="stat-label">Digital Status Tracking</span>
            </div>
          </div>
        </div>
      </div>

      <section className="highlights-section">
        <h2>Admissions Standards</h2>
        <div className="grid-cols-3">
          <div className="highlight-item glass-card">
            <h3>Strict Meritocracy</h3>
            <p>Seat allotments are computed based on candidates' 10+2 scores in core Science and Math courses, ensuring high quality intake.</p>
          </div>
          <div className="highlight-item glass-card">
            <h3>Manual Overrides</h3>
            <p>Admin panel allows counsel managers to carefully verify submitted documents and review candidate profile details manually.</p>
          </div>
          <div className="highlight-item glass-card">
            <h3>Instant PDF Letters</h3>
            <p>Candidates immediately download official digitally generated admission offer letters containing fee structures and guidance notes.</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-container {
          padding: 60px 20px 80px 20px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .about-text-card, .stats-card {
          padding: 30px;
        }
        .about-text-card h2, .stats-card h2 {
          font-size: 1.6rem;
          margin-bottom: 20px;
          color: var(--primary);
        }
        .about-text-card p {
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 0.98rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          height: 80%;
          align-content: center;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 16px;
          border-radius: var(--radius-md);
          background-color: rgba(255,255,255,0.02);
          border: 1px solid var(--border-color);
        }
        .stat-number {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 800;
        }
        .stat-label {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        .highlights-section {
          margin-top: 40px;
        }
        .highlights-section h2 {
          font-size: 1.8rem;
          text-align: center;
          margin-bottom: 30px;
        }
        .highlight-item {
          padding: 24px;
        }
        .highlight-item h3 {
          font-size: 1.2rem;
          margin-bottom: 12px;
          color: var(--primary);
        }
        .highlight-item p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
