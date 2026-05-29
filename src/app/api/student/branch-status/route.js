import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStudent } from '@/lib/auth';

// POST accept or reject allotted branch
export async function POST(request) {
  try {
    const session = await requireStudent();
    const userId = session.user.id;

    const { action } = await request.json();

    if (action !== 'accept' && action !== 'reject') {
      return NextResponse.json({ error: 'Invalid action parameter.' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    if (!student.allottedBranch) {
      return NextResponse.json({ error: 'No branch has been allotted to you yet.' }, { status: 400 });
    }

    const nextStatus = action === 'accept' ? 'accepted' : 'reassignment_requested';

    const updatedStudent = await prisma.student.update({
      where: { userId },
      data: {
        branchStatus: nextStatus,
      },
    });

    return NextResponse.json({
      message: `Branch allotment successfully ${action === 'accept' ? 'accepted' : 'declined'}.`,
      student: updatedStudent,
    });
  } catch (error) {
    console.error('POST Branch Status Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 401 });
  }
}
