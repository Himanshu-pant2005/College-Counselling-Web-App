import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const revalidate = 0;

export async function GET() {
  try {
    // 1. Guard check: only admin
    await requireAdmin();

    // 2. Fetch all students who have completed profiles & submitted marks
    const students = await prisma.student.findMany({
      where: {
        marksSubmitted: true,
      },
      include: {
        user: true,
      },
    });

    // 3. Map & Sort in JS to compute Merit Total (Physics + Chemistry + Math12)
    const sortedStudents = students
      .map((student) => {
        const total = (student.physics || 0) + (student.chemistry || 0) + (student.math12 || 0);
        return {
          ...student,
          total12Marks: total,
        };
      })
      // Sort in descending order of 12th marks total
      .sort((a, b) => b.total12Marks - a.total12Marks);

    // 4. Assign dynamic rank (1-indexed) based on index in sorted list
    const rankedStudents = sortedStudents.map((student, idx) => ({
      ...student,
      meritRank: idx + 1,
    }));

    return NextResponse.json({ students: rankedStudents });
  } catch (error) {
    console.error('GET Admin Students Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message.includes('Forbidden') ? 403 : 500 }
    );
  }
}
