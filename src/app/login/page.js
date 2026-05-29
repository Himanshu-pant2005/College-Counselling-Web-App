'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Read error parameter if passed by NextAuth redirect (e.g. OAuth issues)
  useEffect(() => {
    const authError = searchParams.get('error');
    if (authError) {
      if (authError === 'OAuthAccountNotLinked') {
        setError('This email is already registered with password. Please sign in using email & password.');
      } else {
        setError('An error occurred during authentication. Please try again.');
      }
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session) {
      if (session.user.role === 'admin') {
        router.push('/admin-portal/dashboard');
      } else {
        router.push('/student/dashboard');
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
        // Successful login - session useEffect will handle redirect
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/student/dashboard' });
  };

  if (status === 'loading') {
    return (
      <div className="auth-page-wrapper">
        <div className="glass-card auth-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <p>Verifying authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-wrapper">
      <div className="glass-card auth-card animate-slide-up">
        <div className="auth-header">
          <h1 className="auth-title">Candidate Login</h1>
          <p className="auth-subtitle">Sign in to track your college admission counselling.</p>
        </div>

        {error && (
          <div className="badge badge-danger w-full-alert animate-fade-in">
            {error}
          </div>
        )}

        {/* Google OAuth Login */}
        {process.env.NEXT_PUBLIC_ENABLE_GOOGLE === 'true' || true ? (
          <button type="button" onClick={handleGoogleSignIn} className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        ) : null}

        <div className="divider">or use credentials</div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              className="form-control"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link href="/register">Sign up</Link>
        </p>
      </div>

      <style jsx>{`
        .w-full-alert {
          width: 100%;
          text-align: center;
          padding: 12px;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
          text-transform: none;
        }
        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .auth-footer a {
          color: var(--primary);
          font-weight: 600;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
