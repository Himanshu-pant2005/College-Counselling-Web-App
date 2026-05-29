import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStudent } from '@/lib/auth';

// GET student profile
export async function GET() {
  try {
    const session = await requireStudent();
    const userId = session.user.id;

    const student = await prisma.student.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error('GET Profile Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 401 });
  }
}

// POST create/update profile details
export async function POST(request) {
  try {
    const session = await requireStudent();
    const userId = session.user.id;

    const { name, phone, dob } = await request.json();

    if (!name || !phone || !dob) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update User name and Student profile in a transaction
    const student = await prisma.$transaction(async (tx) => {
      // 1. Update user details
      await tx.user.update({
        where: { id: userId },
        data: { name },
      });

      // 2. Update student profile
      const updatedStudent = await tx.student.update({
        where: { userId },
        data: {
          phone,
          dob,
          profileCompleted: true,
        },
      });

      return updatedStudent;
    });

    return NextResponse.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    console.error('POST Profile Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 401 });
  }
}
