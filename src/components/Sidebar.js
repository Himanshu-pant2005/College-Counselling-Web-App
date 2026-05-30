'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ student }) {
  const pathname = usePathname();

  // Helper to determine step status
  // student profile states:
  // step 1: Profile completed? (student.profileCompleted)
  // step 2: Marks submitted? (student.marksSubmitted)
  // step 3: Branch allotted? (student.allottedBranch is non-null). Status? (student.branchStatus == 'accepted' or 'pending')
  // step 4: Fee payment uploaded? (student.paymentReceipt is non-null). Verified? (student.paymentVerified)
  // step 5: Offer generated? (student.offerGenerated)

  const isProfileCompleted = student?.profileCompleted || false;
  const isMarksSubmitted = student?.marksSubmitted || false;
  const hasBranchAllotted = !!student?.allottedBranch;
  const isBranchAccepted = student?.branchStatus === 'accepted';
  const hasPaymentUploaded = !!student?.paymentReceipt;
  const isPaymentVerified = student?.paymentVerified || false;

  const steps = [
    {
      num: 1,
      title: 'Personal Info',
      path: '/student/profile',
      status: isProfileCompleted ? 'completed' : 'pending',
    },
    {
      num: 2,
      title: 'Academic Marks',
      path: '/student/marks',
      status: isMarksSubmitted ? 'completed' : isProfileCompleted ? 'pending' : 'locked',
    },
    {
      num: 3,
      title: 'Branch Selection',
      path: '/student/branch-status',
      status: isBranchAccepted ? 'completed' : hasBranchAllotted ? 'pending' : isMarksSubmitted ? 'pending' : 'locked',
    },
    {
      num: 4,
      title: 'Fee Payment',
      path: '/student/payment',
      status: isPaymentVerified ? 'completed' : hasPaymentUploaded ? 'pending' : isBranchAccepted ? 'pending' : 'locked',
    },
    {
      num: 5,
      title: 'Offer Letter',
      path: '/student/offer-letter',
      status: student?.offerGenerated ? 'completed' : isPaymentVerified ? 'pending' : 'locked',
    },
  ];

  const getStepIcon = (status, num) => {
    if (status === 'completed') {
      return (
        <span className="step-status-icon completed">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      );
    }
    if (status === 'locked') {
      return (
        <span className="step-status-icon locked">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
      );
    }
    return <span className="step-status-icon current">{num}</span>;
  };

  return (
    <div className="sidebar-card glass-card">
      <div className="sidebar-header">
        <h3>Applicant Flow</h3>
        <p>Admissions Workflow Progress</p>
      </div>

      <div className="sidebar-menu">
        <Link
          href="/student/dashboard"
          className={`sidebar-item ${pathname === '/student/dashboard' ? 'active' : ''}`}
        >
          <span className="sidebar-item-icon">📊</span>
          <span className="sidebar-item-text">Dashboard Home</span>
        </Link>

        <div className="sidebar-divider"><span>Steps</span></div>

        {steps.map((step) => {
          const isLocked = step.status === 'locked';
          const isActive = pathname === step.path;
          
          if (isLocked) {
            return (
              <div key={step.num} className="sidebar-item locked">
                {getStepIcon(step.status, step.num)}
                <span className="sidebar-item-text">{step.title}</span>
              </div>
            );
          }

          return (
            <Link
              key={step.num}
              href={step.path}
              className={`sidebar-item step-item ${isActive ? 'active' : ''} ${step.status === 'completed' ? 'completed' : ''}`}
            >
              {getStepIcon(step.status, step.num)}
              <span className="sidebar-item-text">{step.title}</span>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .sidebar-card {
          padding: 24px;
          height: fit-content;
          position: sticky;
          top: 100px;
        }
        .sidebar-header {
          margin-bottom: 24px;
        }
        .sidebar-header h3 {
          font-size: 1.15rem;
        }
        .sidebar-header p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }
        .sidebar-item:hover:not(.locked) {
          background-color: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
        }
        .sidebar-item.active {
          background-color: rgba(59, 130, 246, 0.15);
          color: var(--primary);
          border-left: 3px solid var(--primary);
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        .sidebar-item.locked {
          color: var(--text-muted);
          cursor: not-allowed;
          opacity: 0.65;
        }
        .sidebar-divider {
          display: flex;
          align-items: center;
          margin: 16px 0 8px 0;
          color: var(--text-muted);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sidebar-divider::after {
          content: '';
          flex: 1;
          margin-left: 10px;
          border-bottom: 1px solid var(--border-color);
        }
        .step-status-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .step-status-icon.completed {
          background-color: var(--success-glow);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .step-status-icon.locked {
          background-color: rgba(255, 255, 255, 0.03);
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }
        .step-status-icon.current {
          background-color: var(--primary-glow);
          color: var(--primary);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        .sidebar-item.active .step-status-icon.current {
          background-color: var(--primary);
          color: white;
        }
        .sidebar-item.completed .sidebar-item-text {
          text-decoration: line-through;
          opacity: 0.75;
        }
      `}</style>
    </div>
  );
}
