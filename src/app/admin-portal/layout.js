import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function AdminPortalLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Allow login page through without auth check
  const isLoginPage = !session;

  if (!session) {
    // Don't redirect — just render children (the login page)
    return <>{children}</>;
  }

  if (session.user.role !== 'admin') {
    // Student tried to access admin — send them home
    redirect('/student/dashboard');
  }

  return (
    <div className="admin-layout">
      <div className="admin-subnav glass-card container">
        <div className="admin-meta">
          <span className="admin-badge">ADMIN CONTROL</span>
          <span className="admin-name">Hi, {session.user.name}</span>
        </div>
        <div className="admin-menu-tabs">
          <Link href="/admin-portal/dashboard" className="admin-tab">
            Candidate Ranks
          </Link>
          <Link href="/admin-portal/seat-matrix" className="admin-tab">
            Seat Matrix CRUD
          </Link>
        </div>
      </div>

      <main className="admin-main container">
        {children}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-layout { padding: 30px 0 80px 0; display: flex; flex-direction: column; gap: 24px; }
        .admin-subnav { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-radius: var(--radius-md); }
        .admin-meta { display: flex; align-items: center; gap: 12px; }
        .admin-badge { background-color: var(--danger-glow); color: var(--danger); font-weight: 700; font-size: 0.72rem; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(239,68,68,0.3); letter-spacing: 0.05em; }
        .admin-name { font-size: 0.9rem; color: var(--text-secondary); }
        .admin-menu-tabs { display: flex; gap: 16px; }
        .admin-tab { font-size: 0.9rem; font-weight: 600; padding: 8px 16px; border-radius: var(--radius-sm); color: var(--text-secondary); transition: var(--transition-fast); }
        .admin-tab:hover { background-color: rgba(255,255,255,0.03); color: var(--text-primary); }
        .admin-main { min-height: 500px; }
        @media (max-width: 600px) {
          .admin-subnav { flex-direction: column; gap: 16px; align-items: flex-start; }
          .admin-menu-tabs { width: 100%; justify-content: space-between; }
          .admin-tab { padding: 8px 0; flex: 1; text-align: center; }
        }
      ` }} />
    </div>
  );
}