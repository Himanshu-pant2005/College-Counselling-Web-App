'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search / Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals / Drawer active items
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalType, setModalType] = useState(''); // 'allot' | 'verify'
  
  // Action state trackers
  const [allotmentBranch, setAllotmentBranch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const loadData = async () => {
    try {
      const [studRes, seatRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/seat-matrix')
      ]);

      if (studRes.ok && seatRes.ok) {
        const studData = await studRes.json();
        const seatData = await seatRes.json();
        setStudents(studData.students);
        setBranches(seatData.seatMatrix);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  let cancelled = false;

  const fetchData = async () => {
    try {
      const [studRes, seatRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/seat-matrix'),
      ]);
      if (!cancelled && studRes.ok && seatRes.ok) {
        const studData = await studRes.json();
        const seatData = await seatRes.json();
        setStudents(studData.students);
        setBranches(seatData.seatMatrix);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  fetchData();
  return () => { cancelled = true; };
}, []);

  const openAllotmentModal = (student) => {
    setSelectedStudent(student);
    setAllotmentBranch(student.allottedBranch || '');
    setModalType('allot');
    setActionError('');
    setActionSuccess('');
  };

  const openVerifyModal = (student) => {
    setSelectedStudent(student);
    setModalType('verify');
    setActionError('');
    setActionSuccess('');
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setModalType('');
    setActionError('');
    setActionSuccess('');
  };

  const handleAllotSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    setActionLoading(true);

    try {
      const res = await fetch('/api/admin/allot-branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          branchCode: allotmentBranch,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || 'Allotment failed.');
      } else {
        setActionSuccess(allotmentBranch ? `Branch ${allotmentBranch} allotted!` : 'Allotment cleared!');
        setTimeout(() => {
          handleCloseModal();
          loadData(); // Re-fetch to update seat counts and student status
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setActionError('An error occurred during seat allotment.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifySubmit = async (action) => {
    setActionError('');
    setActionSuccess('');
    setActionLoading(true);

    try {
      const res = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setActionError(data.error || 'Verification failed.');
      } else {
        setActionSuccess(action === 'approve' ? 'Payment Approved!' : 'Receipt Rejected.');
        setTimeout(() => {
          handleCloseModal();
          loadData();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setActionError('An error occurred updating billing status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter calculations
  const filteredStudents = students.filter((student) => {
    const matchSearch =
      student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'needs_allotment') return !student.allottedBranch;
    if (statusFilter === 'pending') return student.allottedBranch && student.branchStatus === 'pending';
    if (statusFilter === 'accepted') return student.branchStatus === 'accepted' && !student.paymentVerified;
    if (statusFilter === 'verified') return student.paymentVerified;
    return true;
  });

  const getStatusBadge = (student) => {
    if (student.paymentVerified) return <span className="badge badge-success">Admitted</span>;
    if (student.paymentReceipt) return <span className="badge badge-info">Receipt Uploaded</span>;
    if (student.branchStatus === 'accepted') return <span className="badge badge-success">Offer Accepted</span>;
    if (student.branchStatus === 'reassignment_requested') return <span className="badge badge-pending">Reassignment</span>;
    if (student.allottedBranch) return <span className="badge badge-pending">Offered: {student.allottedBranch}</span>;
    return <span className="badge badge-danger">Unallotted</span>;
  };

  if (loading) {
    return <LoadingSpinner message="Querying candidate rank lists..." />;
  }

  return (
    <div className="admin-dashboard-container animate-slide-up">
      {/* Header stats */}
      <div className="section-header" style={{ textAlign: 'left' }}>
        <h2>Candidate Merit Rankings</h2>
        <p>Sorted by 10+2 Cumulative Marks (Physics + Chemistry + Math)</p>
      </div>

      {/* Filters Box */}
      <div className="filters-container glass-card">
        <div className="filter-item">
          <label className="form-label">Search Candidate</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label className="form-label">Filter Status</label>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Candidates</option>
            <option value="needs_allotment">Needs Seat Allotment</option>
            <option value="pending">Awaiting Offer Response</option>
            <option value="accepted">Accepted (Verify Fee)</option>
            <option value="verified">Verified Admission</option>
          </select>
        </div>
      </div>

      {/* Ranks Table */}
      {filteredStudents.length > 0 ? (
        <div className="table-container glass-card" style={{ marginTop: '20px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>PHY</th>
                <th>CHM</th>
                <th>MTH</th>
                <th>Total (12th)</th>
                <th>Prefs (1st / 2nd)</th>
                <th>Allotted Branch</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((stud) => (
                <tr key={stud.id}>
                  <td style={{ fontWeight: '700' }}>#{stud.meritRank}</td>
                  <td>
                    <div className="candidate-cell">
                      <span className="candidate-name">{stud.user.name}</span>
                      <span className="candidate-email">{stud.user.email}</span>
                    </div>
                  </td>
                  <td>{stud.physics}</td>
                  <td>{stud.chemistry}</td>
                  <td>{stud.math12}</td>
                  <td style={{ fontWeight: '600' }}>{stud.total12Marks} / 300</td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <span className="pref-node">{stud.branchChoice1}</span>
                    <span className="pref-arrow">→</span>
                    <span className="pref-node">{stud.branchChoice2}</span>
                  </td>
                  <td>
                    {stud.allottedBranch ? (
                      <span className="badge badge-info">{stud.allottedBranch}</span>
                    ) : (
                      <span className="badge badge-danger">None</span>
                    )}
                  </td>
                  <td>{getStatusBadge(stud)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="actions-cell">
                      {!stud.paymentVerified && (
                        <button
                          onClick={() => openAllotmentModal(stud)}
                          className="btn btn-secondary btn-sm"
                        >
                          {stud.allottedBranch ? 'Re-allot' : 'Allot Branch'}
                        </button>
                      )}
                      {stud.paymentReceipt && !stud.paymentVerified && (
                        <button
                          onClick={() => openVerifyModal(stud)}
                          className="btn btn-warning btn-sm"
                        >
                          Verify Receipt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state glass-card" style={{ marginTop: '20px' }}>
          <p>No candidates found matching the active filter criteria.</p>
        </div>
      )}

      {/* ALLOTMENT MODAL */}
      {modalType === 'allot' && selectedStudent && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content glass-card animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Allot Seat: {selectedStudent.user.name}</h3>
              <button className="close-btn-icon" onClick={handleCloseModal}>×</button>
            </div>
            
            {actionError && <div className="badge badge-danger w-full-alert" style={{ marginBottom: '16px', display: 'block', textTransform: 'none', textAlign: 'center', padding: '12px' }}>{actionError}</div>}
            {actionSuccess && <div className="badge badge-success w-full-alert" style={{ marginBottom: '16px', display: 'block', textTransform: 'none', textAlign: 'center', padding: '12px' }}>{actionSuccess}</div>}

            <form onSubmit={handleAllotSubmit}>
              <div className="student-merit-summary">
                <p><strong>Combined Merit Score:</strong> {selectedStudent.total12Marks} / 300</p>
                <p><strong>First Preference:</strong> {selectedStudent.branchChoice1}</p>
                <p><strong>Second Preference:</strong> {selectedStudent.branchChoice2}</p>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Select Branch to Allot</label>
                <select
                  className="form-control"
                  value={allotmentBranch}
                  onChange={(e) => setAllotmentBranch(e.target.value)}
                >
                  <option value="">-- No Branch (De-allot) --</option>
                  {branches.map((b) => {
                    const avail = b.totalSeats - b.filledSeats;
                    return (
                      <option key={b.id} value={b.branchCode} disabled={avail <= 0 && b.branchCode !== selectedStudent.allottedBranch}>
                        {b.branchName} ({b.branchCode}) - {avail} of {b.totalSeats} seats remaining
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary" disabled={actionLoading}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Lock Seat Allotment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERIFY PAYMENT RECEIPT MODAL */}
      {modalType === 'verify' && selectedStudent && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content glass-card animate-slide-up" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Verify Payment Receipt</h3>
              <button className="close-btn-icon" onClick={handleCloseModal}>×</button>
            </div>

            {actionError && <div className="badge badge-danger w-full-alert" style={{ marginBottom: '16px', display: 'block', textTransform: 'none', textAlign: 'center', padding: '12px' }}>{actionError}</div>}
            {actionSuccess && <div className="badge badge-success w-full-alert" style={{ marginBottom: '16px', display: 'block', textTransform: 'none', textAlign: 'center', padding: '12px' }}>{actionSuccess}</div>}

            <div className="student-merit-summary">
              <p><strong>Candidate:</strong> {selectedStudent.user.name}</p>
              <p><strong>Allotted Branch:</strong> {selectedStudent.allottedBranch}</p>
            </div>

            {/* Receipt Preview */}
            <div className="receipt-preview-box">
              {selectedStudent.paymentReceipt.endsWith('.pdf') ? (
                <div className="pdf-box">
                  <span style={{ fontSize: '3rem' }}>📄</span>
                  <p>PDF Payment Receipt Attached</p>
                  <a href={selectedStudent.paymentReceipt} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ marginTop: '10px' }}>
                    Open PDF receipt in new tab
                  </a>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedStudent.paymentReceipt} alt="Payment Receipt" className="receipt-img" />
              )}
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button
                onClick={() => handleVerifySubmit('reject')}
                className="btn btn-danger"
                disabled={actionLoading}
              >
                Reject Receipt
              </button>
              <button
                onClick={() => handleVerifySubmit('approve')}
                className="btn btn-success"
                disabled={actionLoading}
              >
                Approve & Secure Seat
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .filters-container {
          padding: 16px 24px;
          display: flex;
          gap: 20px;
        }
        .filter-item {
          flex: 1;
        }
        
        .candidate-cell {
          display: flex;
          flex-direction: column;
        }
        .candidate-name {
          font-weight: 600;
        }
        .candidate-email {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        
        .pref-node {
          background-color: rgba(255,255,255,0.03);
          border: 1px solid var(--border-color);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
        .pref-arrow {
          margin: 0 4px;
          color: var(--text-muted);
        }
        .actions-cell {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .modal-content {
          width: 90%;
          max-width: 480px;
          padding: 30px;
          position: relative;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 14px;
          margin-bottom: 20px;
        }
        .modal-header h3 {
          font-size: 1.25rem;
          color: var(--primary);
        }
        .close-btn-icon {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.8rem;
          cursor: pointer;
          line-height: 1;
        }
        .close-btn-icon:hover {
          color: var(--text-primary);
        }
        
        .student-merit-summary {
          background-color: rgba(0,0,0,0.2);
          border-radius: var(--radius-md);
          padding: 14px;
          font-size: 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }

        /* Receipt preview */
        .receipt-preview-box {
          background-color: rgba(0,0,0,0.3);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 16px;
          min-height: 200px;
          max-height: 380px;
          overflow-y: auto;
        }
        .pdf-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-secondary);
          gap: 8px;
        }
        .receipt-img {
          max-width: 100%;
          max-height: 350px;
          object-fit: contain;
          border-radius: var(--radius-sm);
        }

        @media (max-width: 768px) {
          .filters-container {
            flex-direction: column;
            gap: 16px;
          }
          .actions-cell {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}
