'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StepProgress from '@/components/StepProgress';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProfilePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', dob: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch profile data
    async function loadProfile() {
      try {
        const res = await fetch('/api/student/profile');
        if (res.ok) {
          const data = await res.json();
          const student = data.student;
          setFormData({
            name: student.user.name || '',
            email: student.user.email || '',
            phone: student.phone || '',
            dob: student.dob || '',
          });
        } else {
          setError('Failed to fetch profile details.');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred loading profile.');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.dob) {
      setError('Please fill in all fields.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/student/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          dob: formData.dob,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save profile.');
        setSaving(false);
      } else {
        router.push('/student/marks');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred saving your details.');
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving candidate profile details..." />;
  }

  return (
    <div className="profile-page-container">
      <StepProgress currentStep={1} />

      <div className="glass-card form-card-wrapper animate-slide-up">
        <div className="form-card-header">
          <h2>Step 1: Personal Information</h2>
          <p>Please enter your contact details to begin the seat allotment process.</p>
        </div>

        {error && (
          <div className="badge badge-danger w-full-alert" style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '16px', display: 'block', textTransform: 'none', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input
                type="text"
                id="profile-name"
                className="form-control"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email Address (Read-only)</label>
              <input
                type="email"
                id="profile-email"
                className="form-control"
                value={formData.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-phone">Phone Number</label>
              <input
                type="tel"
                id="profile-phone"
                className="form-control"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-dob">Date of Birth</label>
              <input
                type="date"
                id="profile-dob"
                className="form-control"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-actions-row">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </form>
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
        .form-actions-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }
      `}</style>
    </div>
  );
}
