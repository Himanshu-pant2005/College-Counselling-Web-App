'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepProgress from '@/components/StepProgress';
import LoadingSpinner from '@/components/LoadingSpinner';
import { jsPDF } from 'jspdf';

export default function OfferLetterPage() {
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOffer() {
      try {
        const res = await fetch('/api/student/offer-letter');
        if (res.ok) {
          const data = await res.json();
          setStudent(data.student);
        } else {
          const data = await res.json();
          setError(data.error || 'Offer letter is not available yet.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load admission details.');
      } finally {
        setLoading(false);
      }
    }
    loadOffer();
  }, []);

  const downloadPDF = () => {
    if (!student) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const name = student.user.name;
    const branch = student.allottedBranch;
    const email = student.user.email;
    const phone = student.phone || 'N/A';
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Color Theme (Navy)
    const primaryColor = [15, 23, 42]; // #0f172a
    const secondaryColor = [59, 130, 246]; // #3b82f6

    // --- PAGE BORDER ---
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.rect(8, 8, 194, 281);
    doc.rect(10, 10, 190, 277);

    // --- HEADER ---
    doc.setFillColor(...primaryColor);
    doc.rect(10, 10, 190, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('COUNSEL SPHERE ADMISSIONS', 20, 25);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Central Counselling & Seat Allocation Portal', 20, 32);
    doc.text(`Issued Date: ${date}`, 145, 29);

    // --- TITLE ---
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('OFFICIAL PROVISIONAL ADMISSION OFFER LETTER', 20, 58);

    // Divider
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.8);
    doc.line(20, 62, 190, 62);

    // --- STUDENT METADATA TABLE ---
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.rect(20, 70, 170, 42, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.rect(20, 70, 170, 42);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // Slate 600

    doc.text('Candidate Name:', 25, 78);
    doc.text('Candidate ID:', 25, 86);
    doc.text('Email Address:', 25, 94);
    doc.text('Contact Number:', 25, 102);

    doc.text('Allotted Stream:', 115, 78);
    doc.text('Academic Year:', 115, 86);
    doc.text('Allotment Phase:', 115, 94);
    doc.text('Status:', 115, 102);

    // Data values
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(...primaryColor);
    doc.text(name, 58, 78);
    doc.text(student.id, 58, 86);
    doc.text(email, 58, 94);
    doc.text(phone, 58, 102);

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(...secondaryColor);
    doc.text(`B.Tech (${branch})`, 146, 78);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(...primaryColor);
    doc.text(`${new Date().getFullYear()}-${new Date().getFullYear() + 1}`, 146, 86);
    doc.text('Main Merit Round', 146, 94);
    doc.setTextColor(16, 185, 129); // Success Green
    doc.text('SECURED & VERIFIED', 146, 102);

    // --- OFFER BODY ---
    doc.setTextColor(51, 65, 85); // Slate 700
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10.5);
    
    let textY = 126;
    doc.text(`Dear ${name},`, 20, textY);
    
    textY += 10;
    const bodyText1 = `We are pleased to inform you that based on your academic merit in 10+2 Science examinations and your locked preferences, you have been provisionally allotted admission to the Bachelor of Technology (B.Tech) program in the stream of ${branch}.`;
    const splitText1 = doc.splitTextToSize(bodyText1, 170);
    doc.text(splitText1, 20, textY);
    
    textY += splitText1.length * 5 + 6;
    const bodyText2 = `Your admission fee payment of $1,200 USD has been received and verified by our auditing desk. Your seat is now locked, and your registration is officially registered in our enrollment registry database.`;
    const splitText2 = doc.splitTextToSize(bodyText2, 170);
    doc.text(splitText2, 20, textY);

    textY += splitText2.length * 5 + 6;
    const bodyText3 = `You are required to report to the campus auditorium for offline document checking, orientation sessions, and identity verification on August 15th at 09:00 AM IST. Please bring original physical copies of your high school transcripts, 10+2 marksheets, valid photo identification cards, and this digital offer letter.`;
    const splitText3 = doc.splitTextToSize(bodyText3, 170);
    doc.text(splitText3, 20, textY);

    textY += splitText3.length * 5 + 10;
    doc.setFont('Helvetica', 'italic');
    doc.text('We congratulate you on your selection and wish you a highly rewarding academic journey.', 20, textY);

    // --- SIGNATURES ---
    textY += 35;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.line(20, textY, 75, textY);
    doc.line(135, textY, 190, textY);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryColor);
    doc.text('Registrar Office Seal', 20, textY + 5);
    doc.text('Admissions Desk Superintendent', 135, textY + 5);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text('CounselSphere Central Admissions', 20, textY + 9);
    doc.text('Academic Verification Division', 135, textY + 9);

    // --- FOOTER NOTE ---
    doc.setFillColor(...primaryColor);
    doc.rect(10, 277, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('This is a digitally generated document. No physical signature is required. Verify online at verification.counselsphere.edu.', 20, 283);

    // Save File
    const safeName = name.replace(/\s+/g, '_');
    doc.save(`CounselSphere_Offer_Letter_${safeName}.pdf`);
  };

  if (loading) {
    return <LoadingSpinner message="Generating candidate offer letter preview..." />;
  }

  return (
    <div className="offer-letter-container animate-slide-up">
      <StepProgress currentStep={5} />

      <div className="glass-card offer-card-wrapper">
        <div className="offer-card-header">
          <h2>Step 5: Digital Offer Letter</h2>
          <p>Your payment is verified and admission confirmed. Download your official certificate.</p>
        </div>

        {error ? (
          <div className="status-display error-state">
            <div className="status-icon-glow error-glow">❌</div>
            <h3>Access Restricted</h3>
            <p>{error}</p>
            <button onClick={() => router.push('/student/payment')} className="btn btn-primary" style={{ marginTop: '16px' }}>
              Check Payment Step
            </button>
          </div>
        ) : (
          <div className="offer-preview-section">
            {/* Real Letter Visual Representation */}
            <div className="letter-visual glass-card">
              <div className="letter-header">
                <h3>CounselSphere Admissions Desk</h3>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="letter-divider"></div>
              
              <div className="letter-body">
                <p className="salutation">Dear {student?.user.name},</p>
                <p>
                  We are pleased to inform you that based on your academic merit in 10+2 examinations and your choices, you have been provisionally allotted admission to the Bachelor of Technology (B.Tech) program in the stream of <strong>{student?.allottedBranch}</strong>.
                </p>
                <p>
                  Your admission fee deposit has been verified. Your seat is officially locked. Please report to the campus Auditorium block on August 15th at 09:00 AM for registration, orientation, and transcript audits.
                </p>
                
                <div className="letter-signature-row">
                  <div className="sig-block">
                    <div className="sig-line"></div>
                    <span>Registrar Office Seal</span>
                  </div>
                  <div className="sig-block">
                    <div className="sig-line"></div>
                    <span>Admissions Superintendent</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="actions-panel">
              <button onClick={downloadPDF} className="btn btn-success btn-lg">
                📥 Download Official Offer Letter (PDF)
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .offer-card-wrapper {
          padding: 30px;
        }
        .offer-card-header {
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }
        .offer-card-header h2 {
          font-size: 1.4rem;
          margin-bottom: 4px;
          color: var(--primary);
        }
        .offer-card-header p {
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
        .error-glow {
          box-shadow: 0 0 20px var(--danger-glow);
          border-color: var(--danger);
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
        
        /* Letter preview visual */
        .offer-preview-section {
          display: flex;
          flex-direction: column;
          gap: 30px;
          align-items: center;
        }
        .letter-visual {
          width: 100%;
          max-width: 600px;
          background-color: #fff !important;
          color: #1e293b !important;
          padding: 40px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid #cbd5e1;
        }
        .letter-header {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-display);
          font-weight: 700;
          color: #0f172a;
        }
        .letter-header h3 {
          color: #0f172a;
          font-size: 1.15rem;
        }
        .letter-header span {
          font-size: 0.85rem;
          color: #64748b;
        }
        .letter-divider {
          height: 2px;
          background-color: #3b82f6;
          margin: 16px 0 24px 0;
        }
        .letter-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .salutation {
          font-weight: 700;
          color: #0f172a;
        }
        .letter-signature-row {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        .sig-block {
          display: flex;
          flex-direction: column;
          width: 40%;
          align-items: center;
        }
        .sig-line {
          width: 100%;
          height: 1px;
          background-color: #cbd5e1;
          margin-bottom: 8px;
        }
        .sig-block span {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
        }
        .actions-panel {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
