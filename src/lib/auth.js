import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireStudent() {
  const session = await requireAuth();
  if (session.user.role !== 'student') {
    throw new Error('Forbidden: Students only');
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== 'admin') {
    throw new Error('Forbidden: Admins only');
  }
  return session;
}
