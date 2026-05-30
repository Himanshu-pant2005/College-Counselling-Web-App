'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SeatMatrixPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add form state
  const [addForm, setAddForm] = useState({ branchName: '', branchCode: '', totalSeats: 60 });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ branchName: '', totalSeats: 60 });

  const loadBranches = async () => {
    try {
      const res = await fetch('/api/admin/seat-matrix');
      if (res.ok) {
        const data = await res.json();
        setBranches(data.seatMatrix);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showMessage = (type, msg) => {
    if (type === 'success') { setSuccess(msg); setError(''); }
    else { setError(msg); setSuccess(''); }
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/seat-matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('success', `Branch ${addForm.branchCode} added successfully!`);
        setAddForm({ branchName: '', branchCode: '', totalSeats: 60 });
        loadBranches();
      } else {
        showMessage('error', data.error || 'Failed to add branch.');
      }
    } catch (err) {
      showMessage('error', 'An error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditStart = (branch) => {
    setEditingId(branch.id);
    setEditForm({ branchName: branch.branchName, totalSeats: branch.totalSeats });
  };

  const handleEditSave = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/seat-matrix', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm }),
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('success', 'Branch updated successfully!');
        setEditingId(null);
        loadBranches();
      } else {
        showMessage('error', data.error || 'Failed to update branch.');
      }
    } catch (err) {
      showMessage('error', 'An error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Delete branch ${code}? This cannot be undone.`)) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/seat-matrix?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showMessage('success', `Branch ${code} deleted.`);
        loadBranches();
      } else {
        showMessage('error', data.error || 'Failed to delete branch.');
      }
    } catch (err) {
      showMessage('error', 'An error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading seat matrix..." />;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="section-header" style={{ textAlign: 'left' }}>
        <h2>Seat Matrix Management</h2>
        <p>Add, edit, or remove engineering branches and their seat capacities.</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="badge badge-danger" style={{ padding: '12px 16px', borderRadius: '8px', display: 'block', textTransform: 'none', fontSize: '0.9rem' }}>
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="badge badge-success" style={{ padding: '12px 16px', borderRadius: '8px', display: 'block', textTransform: 'none', fontSize: '0.9rem' }}>
          ✅ {success}
        </div>
      )}

      {/* Add Branch Form */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>➕ Add New Branch</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Branch Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Computer Science Engineering"
              value={addForm.branchName}
              onChange={(e) => setAddForm({ ...addForm, branchName: e.target.value })}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Branch Code</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. CSE"
              value={addForm.branchCode}
              onChange={(e) => setAddForm({ ...addForm, branchCode: e.target.value.toUpperCase() })}
              maxLength={6}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Total Seats</label>
            <input
              type="number"
              className="form-control"
              placeholder="60"
              value={addForm.totalSeats}
              onChange={(e) => setAddForm({ ...addForm, totalSeats: e.target.value })}
              min={1}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={actionLoading}>
            {actionLoading ? '...' : 'Add Branch'}
          </button>
        </form>
      </div>

      {/* Branches Table */}
      <div className="table-container glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Branch Name</th>
              <th>Code</th>
              <th>Total Seats</th>
              <th>Filled</th>
              <th>Available</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => {
              const available = branch.totalSeats - branch.filledSeats;
              const isEditing = editingId === branch.id;

              return (
                <tr key={branch.id}>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.branchName}
                        onChange={(e) => setEditForm({ ...editForm, branchName: e.target.value })}
                        style={{ padding: '6px 10px', fontSize: '0.88rem' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600 }}>{branch.branchName}</span>
                    )}
                  </td>
                  <td><span className="badge badge-info">{branch.branchCode}</span></td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        value={editForm.totalSeats}
                        onChange={(e) => setEditForm({ ...editForm, totalSeats: e.target.value })}
                        style={{ padding: '6px 10px', fontSize: '0.88rem', width: '80px' }}
                        min={branch.filledSeats}
                      />
                    ) : (
                      branch.totalSeats
                    )}
                  </td>
                  <td>{branch.filledSeats}</td>
                  <td>
                    <span className={`badge ${available > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {available} left
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {isEditing ? (
                        <>
                          <button onClick={() => handleEditSave(branch.id)} className="btn btn-success btn-sm" disabled={actionLoading}>
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditStart(branch)} className="btn btn-secondary btn-sm">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(branch.id, branch.branchCode)} className="btn btn-danger btn-sm" disabled={actionLoading}>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}