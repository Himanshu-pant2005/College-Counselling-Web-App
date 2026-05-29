import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: { user: true },
  });

  if (!student) {
    redirect('/');
  }

  let branches = [];
  try {
    branches = await prisma.seatMatrix.findMany({
      orderBy: { branchCode: 'asc' },
    });
  } catch (e) {
    console.error(e);
  }

  // Calculate overall profile progress percentage
  let progressPercentage = 10; // Registered
  if (student.profileCompleted) progressPercentage += 20;
  if (student.marksSubmitted) progressPercentage += 20;
  if (student.branchStatus === 'accepted') progressPercentage += 25;
  if (student.paymentVerified) progressPercentage += 25;

  return (
    <div className="dashboard-wrapper animate-slide-up">
      {/* Welcome Banner */}
      <div className="welcome-banner glass-card">
        <div className="welcome-text">
          <h1>Welcome back, <span className="gradient-text">{student.user.name}</span></h1>
          <p>Email: {student.user.email} | ID: {student.id}</p>
        </div>
        <div className="progress-radial-wrapper">
          <div className="progress-info">
            <span className="progress-label">Application Status</span>
            <span className="progress-val gradient-text">{progressPercentage}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Seat Allotment Alert (Step 3 Trigger) */}
      {student.allottedBranch && (
        <div className={`allotment-alert-card glass-card ${student.branchStatus === 'accepted' ? 'accepted' : 'allotted'}`}>
          <div className="alert-content">
            <span className="alert-icon">{student.branchStatus === 'accepted' ? '✅' : '🔔'}</span>
            <div className="alert-text">
              <h3>
                {student.branchStatus === 'accepted'
                  ? `Seat Secured: B.Tech in ${student.allottedBranch}`
                  : `Congratulations! Seat Allotted: B.Tech in ${student.allottedBranch}`}
              </h3>
              <p>
                {student.branchStatus === 'accepted'
                  ? 'Your seat has been locked. Please proceed to payment upload if you haven\'t already.'
                  : 'You have been allotted a seat based on your academic score. Please accept the branch to secure admission.'}
              </p>
            </div>
          </div>
          {student.branchStatus === 'pending' && (
            <Link href="/student/branch-status" className="btn btn-warning">
              Respond to Offer
            </Link>
          )}
          {student.branchStatus === 'accepted' && !student.paymentReceipt && (
            <Link href="/student/payment" className="btn btn-success">
              Proceed to Fee Payment
            </Link>
          )}
        </div>
      )}

      {/* Quick Action Steps */}
      <div className="section-header" style={{ textAlign: 'left', marginTop: '30px' }}>
        <h2>Admission Checklist</h2>
        <p>Complete all steps to lock in your college seat.</p>
      </div>

      <div className="grid-cols-3">
        {/* Step 1 Profile */}
        <div className={`step-card glass-card ${student.profileCompleted ? 'completed' : 'active'}`}>
          <div className="step-num-icon">1</div>
          <h3>Personal Details</h3>
          <p>Fill contact info and date of birth.</p>
          <Link href="/student/profile" className={`btn btn-sm ${student.profileCompleted ? 'btn-secondary' : 'btn-primary'}`}>
            {student.profileCompleted ? 'View Info' : 'Complete Form'}
          </Link>
        </div>

        {/* Step 2 Marks */}
        <div className={`step-card glass-card ${student.marksSubmitted ? 'completed' : student.profileCompleted ? 'active' : 'locked'}`}>
          <div className="step-num-icon">2</div>
          <h3>Academic Marks</h3>
          <p>Submit 10th & 12th grades and branch preferences.</p>
          {student.profileCompleted ? (
            <Link href="/student/marks" className={`btn btn-sm ${student.marksSubmitted ? 'btn-secondary' : 'btn-primary'}`}>
              {student.marksSubmitted ? 'View Scores' : 'Submit Marks'}
            </Link>
          ) : (
            <button className="btn btn-secondary btn-sm" disabled>Locked</button>
          )}
        </div>

        {/* Step 3 Respond to offer */}
        <div className={`step-card glass-card ${student.branchStatus === 'accepted' ? 'completed' : student.allottedBranch ? 'active' : 'locked'}`}>
          <div className="step-num-icon">3</div>
          <h3>Branch Acceptance</h3>
          <p>Review and lock in your allotted branch.</p>
          {student.allottedBranch ? (
            <Link href="/student/branch-status" className={`btn btn-sm ${student.branchStatus !== 'pending' ? 'btn-secondary' : 'btn-primary'}`}>
              {student.branchStatus !== 'pending' ? 'View Status' : 'Respond'}
            </Link>
          ) : (
            <button className="btn btn-secondary btn-sm" disabled>
              {student.marksSubmitted ? 'Waiting for Allotment' : 'Locked'}
            </button>
          )}
        </div>

        {/* Step 4 Payment */}
        <div className={`step-card glass-card ${student.paymentVerified ? 'completed' : student.paymentReceipt ? 'pending' : student.branchStatus === 'accepted' ? 'active' : 'locked'}`}>
          <div className="step-num-icon">4</div>
          <h3>Fee Submission</h3>
          <p>Upload bank slip showing requisite amount deposit.</p>
          {student.branchStatus === 'accepted' ? (
            <Link href="/student/payment" className={`btn btn-sm ${student.paymentReceipt ? 'btn-secondary' : 'btn-primary'}`}>
              {student.paymentVerified ? 'Verified' : student.paymentReceipt ? 'Pending Verification' : 'Upload Receipt'}
            </Link>
          ) : (
            <button className="btn btn-secondary btn-sm" disabled>Locked</button>
          )}
        </div>

        {/* Step 5 Download offer */}
        <div className={`step-card glass-card ${student.paymentVerified ? 'active' : 'locked'}`}>
          <div className="step-num-icon">5</div>
          <h3>Offer Letter</h3>
          <p>Download official signed admission letter (PDF).</p>
          {student.paymentVerified ? (
            <Link href="/student/offer-letter" className="btn btn-success btn-sm">
              Download PDF
            </Link>
          ) : (
            <button className="btn btn-secondary btn-sm" disabled>Locked</button>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .welcome-banner {
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }
        .welcome-text h1 {
          font-size: 1.8rem;
          margin-bottom: 6px;
        }
        .welcome-text p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        
        .progress-radial-wrapper {
          display: flex;
          flex-direction: column;
          width: 200px;
          gap: 8px;
        }
        .progress-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .progress-label {
          color: var(--text-secondary);
        }
        .progress-val {
          font-size: 0.9rem;
          font-weight: 700;
        }
        .progress-bar-container {
          height: 6px;
          background-color: var(--border-color);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: 3px;
        }

        /* Allotment Alert */
        .allotment-alert-card {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }
        .allotment-alert-card.allotted {
          border-left: 4px solid var(--warning);
        }
        .allotment-alert-card.accepted {
          border-left: 4px solid var(--success);
        }
        .alert-content {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .alert-icon {
          font-size: 1.8rem;
        }
        .alert-text h3 {
          font-size: 1.1rem;
          margin-bottom: 4px;
        }
        .alert-text p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        /* Checklist Step Cards */
        .step-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
          position: relative;
        }
        .step-num-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
        }
        .step-card.active .step-num-icon {
          background: var(--accent-gradient);
          color: white;
          box-shadow: 0 0 10px var(--primary-glow);
        }
        .step-card.completed .step-num-icon {
          background-color: var(--success-glow);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .step-card.locked {
          opacity: 0.5;
        }
        .step-card h3 {
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        .step-card p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.5;
          min-height: 40px;
        }

        @media (max-width: 768px) {
          .welcome-banner, .allotment-alert-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .progress-radial-wrapper {
            width: 100%;
          }
          .allotment-alert-card .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
