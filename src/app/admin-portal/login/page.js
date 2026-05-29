'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (status === 'authenticated' && session) {
      if (session.user.role === 'admin') {
        router.push('/admin-portal/dashboard');
      } else {
        setError('Forbidden: Candidate account cannot access the Admin panel.');
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Successful login
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="auth-page-wrapper">
        <div className="glass-card auth-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <p>Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-wrapper admin-login-bg">
      <div className="glass-card auth-card animate-slide-up admin-border">
        <div className="auth-header">
          <span className="badge badge-danger" style={{ marginBottom: '16px' }}>
            Administrative Control Panel
          </span>
          <h1 className="auth-title">Admin Desk Login</h1>
          <p className="auth-subtitle">Verify candidate lists and manage stream allocations.</p>
        </div>

        {error && (
          <div className="badge badge-danger w-full-alert" style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'block', textTransform: 'none', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Admin Email Address</label>
            <input
              type="email"
              id="admin-email"
              className="form-control"
              placeholder="admin@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Control Password</label>
            <input
              type="password"
              id="admin-password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-danger"
            style={{ width: '100%', marginTop: '15px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Access Control Board'}
          </button>
        </form>

        <p className="auth-footer-help">
          For technical issues contact database administrator at <br />
          <strong>portal-dev@counselsphere.edu</strong>
        </p>
      </div>

      <style jsx>{`
        .admin-login-bg {
          background: radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.05) 0%, rgba(0, 0, 0, 0) 65%);
        }
        .admin-border {
          border-color: rgba(239, 68, 68, 0.2);
        }
        .auth-footer-help {
          margin-top: 30px;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
