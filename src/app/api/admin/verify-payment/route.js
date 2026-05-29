import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(request) {
  try {
    await requireAdmin();

    const { studentId, action } = await request.json();

    if (!studentId || !action) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'Action must be either "approve" or "reject".' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    if (action === 'approve') {
      // Approve receipt
      const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: {
          paymentVerified: true,
          offerGenerated: true,
        },
      });

      return NextResponse.json({
        message: 'Payment verified and offer letter generated successfully.',
        student: updatedStudent,
      });
    } else {
      // Reject receipt (clear it)
      const updatedStudent = await prisma.student.update({
        where: { id: studentId },
        data: {
          paymentReceipt: null, // Clear receipt so student can upload again
          paymentVerified: false,
          offerGenerated: false,
        },
      });

      return NextResponse.json({
        message: 'Payment receipt rejected. Candidate has been notified to re-upload.',
        student: updatedStudent,
      });
    }
  } catch (error) {
    console.error('Verify Payment error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
