'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  // Don't show regular Navbar on portal/admin layouts if they have their own sidebars
  // But since we want to keep it simple, we can display Navbar everywhere, or exclude it on /student/* and /admin-portal/* pages if they have their own custom navigation.
  // Actually, keeping the landing page navbar separate or keeping a global top navbar with custom portal sidebars is very neat. Let's make it look clean everywhere.

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <span className="gradient-text">CounselSphere</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link href="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link href="/about" className={`nav-item ${isActive('/about') ? 'active' : ''}`}>
            About
          </Link>
          <Link href="/contact" className={`nav-item ${isActive('/contact') ? 'active' : ''}`}>
            Contact
          </Link>

          {session ? (
            <>
              {session.user.role === 'admin' ? (
                <Link
                  href="/admin-portal/dashboard"
                  className={`nav-item portal-link ${isActive('/admin-portal/dashboard') ? 'active' : ''}`}
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  href="/student/dashboard"
                  className={`nav-item portal-link ${isActive('/student/dashboard') ? 'active' : ''}`}
                >
                  Student Portal
                </Link>
              )}
              <div className="user-profile-menu">
                <span className="user-name">Hi, {session.user.name.split(' ')[0]}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn btn-secondary btn-sm-nav"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link href="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Links */}
      {mobileMenuOpen && (
        <div className="mobile-links animate-fade-in">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`mobile-nav-item ${isActive('/about') ? 'active' : ''}`}
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`mobile-nav-item ${isActive('/contact') ? 'active' : ''}`}
          >
            Contact
          </Link>

          {session ? (
            <>
              {session.user.role === 'admin' ? (
                <Link
                  href="/admin-portal/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-item ${isActive('/admin-portal/dashboard') ? 'active' : ''}`}
                >
                  Admin Panel
                </Link>
              ) : (
                <Link
                  href="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-item ${isActive('/student/dashboard') ? 'active' : ''}`}
                >
                  Student Portal
                </Link>
              )}
              <div className="mobile-user-info">
                <span>Logged in as: <strong>{session.user.name}</strong></span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="btn btn-danger w-full-mobile"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="mobile-auth-buttons">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary w-full">
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary w-full">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .navbar {
          background-color: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 1000;
          display: flex;
          align-items: center;
        }
        .navbar-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .navbar-logo {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .nav-item {
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text-secondary);
          position: relative;
          padding: 8px 0;
        }
        .nav-item:hover, .nav-item.active {
          color: var(--text-primary);
        }
        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--accent-gradient);
          border-radius: 2px;
        }
        .portal-link {
          color: var(--primary);
          font-weight: 600;
        }
        .user-profile-menu {
          display: flex;
          align-items: center;
          gap: 16px;
          border-left: 1px solid var(--border-color);
          padding-left: 20px;
        }
        .user-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .btn-sm-nav {
          padding: 6px 14px;
          font-size: 0.85rem;
        }
        .auth-buttons {
          display: flex;
          gap: 12px;
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }
        .mobile-links {
          display: none;
          position: absolute;
          top: 80px;
          left: 0;
          width: 100%;
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          padding: 20px;
          flex-direction: column;
          gap: 16px;
          box-shadow: var(--shadow-lg);
        }
        .mobile-nav-item {
          font-size: 1.1rem;
          font-weight: 500;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }
        .mobile-nav-item.active {
          color: var(--primary);
        }
        .mobile-user-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }
        .w-full-mobile {
          width: 100%;
        }
        .mobile-auth-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }
        .w-full {
          width: 100%;
        }

        @media (max-width: 768px) {
          .navbar-links {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          .mobile-links {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}
