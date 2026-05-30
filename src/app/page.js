import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function LandingPage() {
  // Redirect logged-in users straight to their portal
  const session = await getServerSession(authOptions);
  if (session) {
    if (session.user.role === 'admin') redirect('/admin-portal/dashboard');
    else redirect('/student/dashboard');
  }

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
                      <td><span className="badge badge-info">{branch.branchCode}</span></td>
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
            <p>No branch information available. Run database seeding to populate branches.</p>
          </div>
        )}
      </section>

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
    </div>
  );
}