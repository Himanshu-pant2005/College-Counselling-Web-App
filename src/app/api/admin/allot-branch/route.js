import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function POST(request) {
  try {
    await requireAdmin();

    const { studentId, branchCode } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: 'Missing student ID.' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch student profile
      const student = await tx.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new Error('Student profile not found.');
      }

      const prevBranch = student.allottedBranch;

      // If branch remains the same, do nothing
      if (prevBranch === branchCode) {
        return student;
      }

      // 2. Release previous seat if student was already allotted elsewhere
      if (prevBranch) {
        const prevSeatMatrix = await tx.seatMatrix.findUnique({
          where: { branchCode: prevBranch },
        });

        if (prevSeatMatrix && prevSeatMatrix.filledSeats > 0) {
          await tx.seatMatrix.update({
            where: { branchCode: prevBranch },
            data: { filledSeats: prevSeatMatrix.filledSeats - 1 },
          });
        }
      }

      // 3. Allot new seat
      if (branchCode) {
        const newSeatMatrix = await tx.seatMatrix.findUnique({
          where: { branchCode },
        });

        if (!newSeatMatrix) {
          throw new Error(`Branch with code ${branchCode} not found in Seat Matrix.`);
        }

        if (newSeatMatrix.filledSeats >= newSeatMatrix.totalSeats) {
          throw new Error(`Capacity full for branch ${branchCode}. Total seats: ${newSeatMatrix.totalSeats}`);
        }

        // Increment seat count
        await tx.seatMatrix.update({
          where: { branchCode },
          data: { filledSeats: newSeatMatrix.filledSeats + 1 },
        });
      }

      // 4. Update student profile
      const updatedStudent = await tx.student.update({
        where: { id: studentId },
        data: {
          allottedBranch: branchCode || null,
          branchStatus: 'pending', // reset status so student can respond to the allotment
          // Reset offer letter flags since a new branch has been allotted
          offerGenerated: false,
          paymentVerified: false,
        },
      });

      return updatedStudent;
    });

    return NextResponse.json({
      message: branchCode ? `Branch ${branchCode} successfully allotted.` : 'Branch allotment cleared.',
      student: result,
    });
  } catch (error) {
    console.error('Allot Branch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during allotment.' },
      { status: error.message.includes('not found') || error.message.includes('full') ? 400 : 500 }
    );
  }
}
