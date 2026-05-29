import Link from 'next/link';
import { prisma } from '@/lib/prisma';

// Enable dynamic rendering so it fetches fresh seat counts on every page load
export const revalidate = 0;

export default async function LandingPage() {
  let branches = [];
  try {
    branches = await prisma.seatMatrix.findMany({
      orderBy: { branchCode: 'asc' },
    });
  } catch (error) {
    console.error('Failed to fetch seat matrix:', error);
  }

  return (
    <div className="landing-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge badge-info animate-slide-up" style={{ marginBottom: '16px' }}>
            Admissions Open {new Date().getFullYear()}
          </span>
          <h1 className="hero-title animate-slide-up">
            Your Future Starts Here. <br />
            <span className="gradient-text">Allotment. Verification. Success.</span>
          </h1>
          <p className="hero-subtitle animate-slide-up">
            CounselSphere handles the entire college admission counselling pipeline from online profile submission to direct merit-based seat allocation and verified digital offer letters.
          </p>
          <div className="hero-actions animate-slide-up">
            <Link href="/register" className="btn btn-primary btn-lg">
              Register Candidate
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              Applicant Login
            </Link>
          </div>
        </div>
      </section>

      {/* Seat Matrix Section */}
      <section className="seats-section container">
        <div className="section-header">
          <h2>Live Seat Matrix</h2>
          <p>Real-time availability of seats in various undergraduate branches.</p>
        </div>
        
        {branches.length > 0 ? (
          <div className="table-container glass-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Branch Name</th>
                  <th>Branch Code</th>
                  <th>Total Seats</th>
                  <th>Seats Filled</th>
                  <th>Available Seats</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => {
                  const available = branch.totalSeats - branch.filledSeats;
                  return (
                    <tr key={branch.id}>
                      <td style={{ fontWeight: '600' }}>{branch.branchName}</td>
                      <td>
                        <span className="badge badge-info">{branch.branchCode}</span>
                      </td>
                      <td>{branch.totalSeats}</td>
                      <td>{branch.filledSeats}</td>
                      <td>
                        <span className={`badge ${available > 0 ? 'badge-success' : 'badge-danger'}`}>
                          {available} left
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state glass-card">
            <p>No branch information is available at the moment. Run database seeding to populate branches.</p>
          </div>
        )}
      </section>

      {/* 5-Step Process Timeline */}
      <section className="timeline-section container">
        <div className="section-header">
          <h2>How Counselling Works</h2>
          <p>Follow these five structured steps to complete your seat allotment process.</p>
        </div>
        
        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          <div className="timeline-item left">
            <div className="timeline-badge">1</div>
            <div className="timeline-card glass-card">
              <h3>Profile Registration</h3>
              <p>Sign up, login, and fill out your personal information including contact details and date of birth.</p>
            </div>
          </div>
          
          <div className="timeline-item right">
            <div className="timeline-badge">2</div>
            <div className="timeline-card glass-card">
              <h3>Marks & Choice Filling</h3>
              <p>Submit your High School (10th) subject marks and 10+2 (12th) Science/Maths scores, and lock in your top two branch preferences.</p>
            </div>
          </div>
          
          <div className="timeline-item left">
            <div className="timeline-badge">3</div>
            <div className="timeline-card glass-card">
              <h3>Merit Ranking & Allotment</h3>
              <p>The Admissions Panel ranks applicants based on 10+2 scores and manually allots seats. You can then accept the branch or ask for reassignment.</p>
            </div>
          </div>
          
          <div className="timeline-item right">
            <div className="timeline-badge">4</div>
            <div className="timeline-card glass-card">
              <h3>Fee Deposit Receipt</h3>
              <p>Upon accepting your seat, upload a scan/PDF of your bank deposit slip as proof of requisite admission fee payment.</p>
            </div>
          </div>
          
          <div className="timeline-item left">
            <div className="timeline-badge">5</div>
            <div className="timeline-card glass-card">
              <h3>Offer Letter PDF</h3>
              <p>Once the administrator verifies the payment receipt, download your verified, official College Admission Offer Letter.</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-container {
          display: flex;
          flex-direction: column;
          gap: 80px;
          padding-bottom: 80px;
        }
        
        /* Hero Section Styling */
        .hero-section {
          text-align: center;
          padding: 100px 20px 60px 20px;
          background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, rgba(0, 0, 0, 0) 60%);
        }
        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }
        .hero-title {
          font-size: 3.8rem;
          line-height: 1.15;
          margin-bottom: 24px;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--text-secondary);
          margin-bottom: 36px;
          line-height: 1.7;
          max-width: 660px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .btn-lg {
          padding: 14px 28px;
          font-size: 1.05rem;
        }

        /* General Section Header */
        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .section-header h2 {
          font-size: 2.2rem;
          margin-bottom: 12px;
        }
        .section-header p {
          color: var(--text-secondary);
          font-size: 1rem;
        }
        
        .empty-state {
          padding: 40px;
          text-align: center;
          color: var(--text-secondary);
        }

        /* Timeline Styling */
        .timeline-container {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 0;
        }
        .timeline-line {
          position: absolute;
          width: 4px;
          background: var(--border-color);
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 2px;
        }
        .timeline-item {
          padding: 10px 40px;
          position: relative;
          width: 50%;
        }
        .timeline-item.left {
          left: 0;
          text-align: right;
        }
        .timeline-item.right {
          left: 50%;
          text-align: left;
        }
        .timeline-badge {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--accent-gradient);
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 15px;
          z-index: 10;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
        }
        .timeline-item.left .timeline-badge {
          right: -20px;
        }
        .timeline-item.right .timeline-badge {
          left: -20px;
        }
        .timeline-card {
          padding: 24px;
          border-radius: var(--radius-lg);
        }
        .timeline-card h3 {
          font-size: 1.25rem;
          margin-bottom: 8px;
          color: var(--primary);
        }
        .timeline-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .hero-actions {
            flex-direction: column;
            gap: 12px;
            padding: 0 40px;
          }
          .timeline-line {
            left: 31px;
          }
          .timeline-item {
            width: 100%;
            padding-left: 70px;
            padding-right: 20px;
            text-align: left !important;
          }
          .timeline-item.right {
            left: 0;
          }
          .timeline-item.left .timeline-badge,
          .timeline-item.right .timeline-badge {
            left: 11px;
            right: auto;
          }
        }
      `}</style>
    </div>
  );
}
