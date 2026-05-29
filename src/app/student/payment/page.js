'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepProgress from '@/components/StepProgress';
import LoadingSpinner from '@/components/LoadingSpinner';
import FileUpload from '@/components/FileUpload';

export default function PaymentPage() {
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadStatus = async () => {
    try {
      const res = await fetch('/api/student/profile');
      if (res.ok) {
        const data = await res.json();
        setStudent(data.student);
        
        // Guard check: redirect if seat not accepted
        if (data.student.branchStatus !== 'accepted') {
          router.push('/student/dashboard');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load candidate details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a payment receipt file to upload.');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    const formData = new FormData();
    formData.append('payment_receipt', selectedFile);

    try {
      const res = await fetch('/api/student/payment', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to upload payment receipt.');
      } else {
        setSuccess('Payment receipt submitted successfully for verification!');
        setStudent(data.student);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during file upload.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving candidate billing status..." />;
  }

  return (
    <div className="payment-page-container animate-slide-up">
      <StepProgress currentStep={4} />

      <div className="glass-card form-card-wrapper">
        <div className="form-card-header">
          <h2>Step 4: Admission Fee Deposit</h2>
          <p>Complete your bank transaction and upload the digital proof.</p>
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

        {/* Bank Instructions */}
        <div className="bank-instructions-card glass-card">
          <h3>Central Bank Transfer Instructions</h3>
          <div className="bank-details-grid">
            <div className="detail-item"><strong>Bank Name:</strong> Central National Bank</div>
            <div className="detail-item"><strong>Beneficiary:</strong> CounselSphere Admissions</div>
            <div className="detail-item"><strong>Account Number:</strong> 98765432109</div>
            <div className="detail-item"><strong>IFSC Code:</strong> CNB0000845</div>
            <div className="detail-item"><strong>Branch Name:</strong> Connaught Place, New Delhi</div>
            <div className="detail-item"><strong>Admission Fee:</strong> $1,200 USD (Requisite Fee)</div>
          </div>
          <p className="instruction-note">
            ⚠️ <em>Important: Please write your Full Name and Candidate ID in the transaction reference/remark. Scan and save the receipt as a PDF or JPG before uploading.</em>
          </p>
        </div>

        {/* Verification Status Display */}
        {student?.paymentVerified ? (
          <div className="payment-status-display success">
            <span className="status-icon">✅</span>
            <div className="status-text">
              <h3>Payment Verified!</h3>
              <p>Admissions desk has successfully verified your bank receipt. Your seat is officially secured.</p>
            </div>
            <button onClick={() => router.push('/student/offer-letter')} className="btn btn-success">
              Get Offer Letter
            </button>
          </div>
        ) : student?.paymentReceipt ? (
          <div className="payment-status-display pending">
            <span className="status-icon">⏳</span>
            <div className="status-text">
              <h3>Receipt Uploaded</h3>
              <p>Your payment receipt is submitted and is currently awaiting manual verification by the admissions administrator.</p>
            </div>
          </div>
        ) : null}

        {/* Upload form */}
        {!student?.paymentVerified && (
          <form onSubmit={handleUpload} style={{ marginTop: '30px' }}>
            <FileUpload
              onFileSelect={(file) => setSelectedFile(file)}
              existingFile={student?.paymentReceipt}
              label={student?.paymentReceipt ? 'Replace Payment Receipt' : 'Upload Payment Receipt'}
            />

            <div className="form-actions-row">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={uploading || !selectedFile}
              >
                {uploading ? 'Uploading Receipt...' : 'Submit Receipt'}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .form-card-wrapper {
          padding: 30px;
        }
        .form-card-header {
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }
        .form-card-header h2 {
          font-size: 1.4rem;
          margin-bottom: 4px;
          color: var(--primary);
        }
        .form-card-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .bank-instructions-card {
          padding: 20px;
          margin-bottom: 24px;
          border-left: 4px solid var(--primary);
        }
        .bank-instructions-card h3 {
          font-size: 1.05rem;
          margin-bottom: 12px;
        }
        .bank-details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .instruction-note {
          margin-top: 16px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .payment-status-display {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
        }
        .payment-status-display.success {
          background-color: var(--success-glow);
          border: 1px solid rgba(16, 185, 129, 0.3);
          justify-content: space-between;
        }
        .payment-status-display.pending {
          background-color: var(--warning-glow);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .status-icon {
          font-size: 1.8rem;
        }
        .status-text h3 {
          font-size: 1rem;
          margin-bottom: 2px;
        }
        .status-text p {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .form-actions-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }
        @media (max-width: 600px) {
          .bank-details-grid {
            grid-template-columns: 1fr;
          }
          .payment-status-display.success {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .payment-status-display.success button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
