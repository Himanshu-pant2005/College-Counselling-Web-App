import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStudent } from '@/lib/auth';

// GET student marks and branch preferences
export async function GET() {
  try {
    const session = await requireStudent();
    const userId = session.user.id;

    const student = await prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error('GET Marks Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 401 });
  }
}

// POST submit marks and choices
export async function POST(request) {
  try {
    const session = await requireStudent();
    const userId = session.user.id;

    const body = await request.json();
    const {
      mathHs, scienceHs, englishHs, hindiHs,
      physics, chemistry, math12,
      branchChoice1, branchChoice2
    } = body;

    // Validate marks values
    const validateMark = (val) => {
      const parsed = parseInt(val, 10);
      return !isNaN(parsed) && parsed >= 0 && parsed <= 100;
    };

    if (
      !validateMark(mathHs) || !validateMark(scienceHs) || !validateMark(englishHs) || !validateMark(hindiHs) ||
      !validateMark(physics) || !validateMark(chemistry) || !validateMark(math12)
    ) {
      return NextResponse.json({ error: 'All marks must be integers between 0 and 100.' }, { status: 400 });
    }

    if (!branchChoice1 || !branchChoice2) {
      return NextResponse.json({ error: 'Please select both branch preferences.' }, { status: 400 });
    }

    if (branchChoice1 === branchChoice2) {
      return NextResponse.json({ error: 'First and Second preferences must be different.' }, { status: 400 });
    }

    // Save preferences
    const student = await prisma.student.update({
      where: { userId },
      data: {
        mathHs: parseInt(mathHs, 10),
        scienceHs: parseInt(scienceHs, 10),
        englishHs: parseInt(englishHs, 10),
        hindiHs: parseInt(hindiHs, 10),
        physics: parseInt(physics, 10),
        chemistry: parseInt(chemistry, 10),
        math12: parseInt(math12, 10),
        branchChoice1,
        branchChoice2,
        marksSubmitted: true,
      },
    });

    return NextResponse.json({ message: 'Academic marks and preferences saved successfully.', student });
  } catch (error) {
    console.error('POST Marks Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 401 });
  }
}
