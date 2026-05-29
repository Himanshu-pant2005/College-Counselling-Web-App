'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepProgress from '@/components/StepProgress';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function BranchStatusPage() {
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch('/api/student/profile');
        if (res.ok) {
          const data = await res.json();
          setStudent(data.student);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load branch allotment status.');
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  const handleAction = async (action) => {
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/student/branch-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update allotment response.');
      } else {
        setStudent(data.student);
        setSuccess(
          action === 'accept'
            ? 'Branch accepted! Redirecting to fee payment page...'
            : 'Reassignment requested successfully.'
        );
        
        if (action === 'accept') {
          setTimeout(() => {
            router.push('/student/payment');
            router.refresh();
          }, 2000);
        }
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred submitting selection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving branch allotment status..." />;
  }

  return (
    <div className="branch-status-container animate-slide-up">
      <StepProgress currentStep={3} />

      <div className="glass-card status-card-wrapper">
        <div className="status-card-header">
          <h2>Step 3: Branch Allotment Decision</h2>
          <p>Verify your seat allotment and lock in your choice.</p>
        </div>

        {error && (
          <div className="badge badge-danger w-full-alert" style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'block', textTransform: 'none', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="badge badge-success w-full-alert" style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'block', textTransform: 'none', textAlign: 'center' }}>
            {success}
          </div>
        )}

        {!student?.allottedBranch ? (
          <div className="status-display pending-state">
            <div className="status-icon-glow pulse">⏳</div>
            <h3>Allotment Pending</h3>
            <p>
              Your academic profile is successfully submitted. The Admissions Panel is currently ranking profiles based on intermediate marks merit.
            </p>
            <p className="subtext">
              Please check back soon. Your preferences: <strong>{student?.branchChoice1}</strong> (First Choice), <strong>{student?.branchChoice2}</strong> (Second Choice).
            </p>
          </div>
        ) : (
          <div className="status-display allotted-state">
            {student.branchStatus === 'pending' && (
              <>
                <div className="status-icon-glow success-glow">🎉</div>
                <h3>Seat Offered!</h3>
                <p className="offer-declaration">
                  You have been allotted a seat in: <br />
                  <span className="gradient-text branch-name">B.Tech in {student.allottedBranch}</span>
                </p>
                <p className="instructions">
                  Please respond to this offer. Accepting will direct you to pay the admission fee and lock your seat. Requesting reassignment will release this seat and enter your application into the next round of counselling.
                </p>
                
                <div className="actions-row">
                  <button
                    onClick={() => handleAction('accept')}
                    className="btn btn-success"
                    disabled={submitting}
                  >
                    Accept & Lock Seat
                  </button>
                  <button
                    onClick={() => handleAction('reject')}
                    className="btn btn-warning"
                    disabled={submitting}
                  >
                    Request Re-assignment
                  </button>
                </div>
              </>
            )}

            {student.branchStatus === 'accepted' && (
              <div className="status-feedback accepted">
                <div className="status-icon-glow success-glow">✅</div>
                <h3>Seat Accepted</h3>
                <p>
                  You have accepted the seat for: <strong className="gradient-text">B.Tech in {student.allottedBranch}</strong>.
                </p>
                <p className="instructions">
                  Please proceed to upload your bank deposit receipt under the next step.
                </p>
                <button
                  onClick={() => router.push('/student/payment')}
                  className="btn btn-primary"
                  style={{ marginTop: '20px' }}
                >
                  Go to Fee Payment
                </button>
              </div>
            )}

            {student.branchStatus === 'reassignment_requested' && (
              <div className="status-feedback reassignment">
                <div className="status-icon-glow warning-glow">🔄</div>
                <h3>Reassignment Requested</h3>
                <p>
                  You declined the offer for <strong>B.Tech in {student.allottedBranch}</strong> and requested reassignment.
                </p>
                <p className="instructions">
                  Your application will be evaluated in the subsequent allocation rounds based on seat vacancies and merit criteria.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .status-card-wrapper {
          padding: 30px;
        }
        .status-card-header {
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }
        .status-card-header h2 {
          font-size: 1.4rem;
          margin-bottom: 4px;
          color: var(--primary);
        }
        .status-card-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .status-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 20px;
          gap: 16px;
        }
        .status-icon-glow {
          font-size: 3rem;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.02);
          border-radius: 50%;
          border: 1px solid var(--border-color);
          margin-bottom: 10px;
        }
        .pulse {
          animation: pulseIcon 2s infinite ease-in-out;
        }
        .success-glow {
          box-shadow: 0 0 20px var(--success-glow);
          border-color: var(--success);
        }
        .warning-glow {
          box-shadow: 0 0 20px var(--warning-glow);
          border-color: var(--warning);
        }
        .status-display h3 {
          font-size: 1.4rem;
        }
        .status-display p {
          max-width: 520px;
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .status-display .subtext {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 10px;
        }
        .offer-declaration {
          font-size: 1.1rem;
        }
        .branch-name {
          font-size: 1.8rem;
          font-weight: 800;
          font-family: var(--font-display);
        }
        .actions-row {
          display: flex;
          gap: 16px;
          margin-top: 20px;
        }
        .status-feedback {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @media (max-width: 600px) {
          .actions-row {
            flex-direction: column;
            width: 100%;
          }
          .actions-row button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
