import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/Sidebar';

export const revalidate = 0;

export default async function StudentPortalLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== 'student') {
    redirect('/login?error=Forbidden');
  }

  let student = null;
  try {
    student = await prisma.student.findUnique({
      where: { userId: session.user.id },
    });
  } catch (error) {
    console.error('Failed to load student status for sidebar:', error);
  }

  if (!student) {
    // Session exists but student record is missing, redirect to home to let NextAuth callbacks re-run and fix it
    redirect('/');
  }

  return (
    <div className="portal-layout-container container animate-fade-in">
      <div className="portal-grid">
        <aside className="portal-sidebar">
          <Sidebar student={student} />
        </aside>
        
        <main className="portal-main-content">
          {children}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .portal-layout-container {
          padding: 40px 20px 80px 20px;
        }
        .portal-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .portal-grid {
            grid-template-columns: 1fr;
          }
          .portal-sidebar {
            position: relative;
            top: 0;
          }
        }
      ` }} />
    </div>
  );
}
