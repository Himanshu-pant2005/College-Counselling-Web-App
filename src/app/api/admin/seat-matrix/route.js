import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const revalidate = 0;

// GET list of branches
export async function GET() {
  try {
    await requireAdmin();
    const seatMatrix = await prisma.seatMatrix.findMany({
      orderBy: { branchCode: 'asc' },
    });
    return NextResponse.json({ seatMatrix });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 401 });
  }
}

// POST create branch
export async function POST(request) {
  try {
    await requireAdmin();
    const { branchName, branchCode, totalSeats } = await request.json();

    if (!branchName || !branchCode || !totalSeats) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const codeUpper = branchCode.toUpperCase();

    // Check if code already exists
    const existing = await prisma.seatMatrix.findFirst({
      where: {
        OR: [
          { branchCode: codeUpper },
          { branchName }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'A branch with this name or code already exists.' }, { status: 400 });
    }

    const newBranch = await prisma.seatMatrix.create({
      data: {
        branchName,
        branchCode: codeUpper,
        totalSeats: parseInt(totalSeats, 10),
        filledSeats: 0,
      },
    });

    return NextResponse.json({ message: 'Branch added successfully.', branch: newBranch }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 401 });
  }
}

// PUT edit branch
export async function PUT(request) {
  try {
    await requireAdmin();
    const { id, branchName, totalSeats } = await request.json();

    if (!id || !branchName || totalSeats === undefined) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const updated = await prisma.seatMatrix.update({
      where: { id },
      data: {
        branchName,
        totalSeats: parseInt(totalSeats, 10),
      },
    });

    return NextResponse.json({ message: 'Branch updated successfully.', branch: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 401 });
  }
}

// DELETE delete branch
export async function DELETE(request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing branch ID parameter.' }, { status: 400 });
    }

    await prisma.seatMatrix.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Branch deleted successfully.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 401 });
  }
}
