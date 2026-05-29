import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStudent } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireStudent();
    const userId = session.user.id;

    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    if (!student.paymentVerified) {
      return NextResponse.json({ error: 'Your admission fee payment has not been verified by the administrator yet.' }, { status: 400 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error('GET Offer Letter details error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 401 });
  }
}
