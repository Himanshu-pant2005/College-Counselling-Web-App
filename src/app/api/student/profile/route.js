import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStudent } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireStudent();

    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
      include: { user: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    const session = await requireStudent();
    const userId = session.user.id;

    const { name, phone, dob } = await request.json();

    if (!name || !phone || !dob) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // name, phone, dob all live on User
      await tx.user.update({
        where: { id: userId },
        data: { name, phone, dob },
      });

      // just flip profileCompleted on Student
      await tx.student.update({
        where: { userId },
        data: { profileCompleted: true },
      });
    });

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('POST Profile Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}