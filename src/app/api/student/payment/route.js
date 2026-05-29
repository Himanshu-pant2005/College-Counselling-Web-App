import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStudent } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
  try {
    const session = await requireStudent();
    const userId = session.user.id;

    // Check if candidate accepted branch
    const student = await prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found.' }, { status: 404 });
    }

    if (student.branchStatus !== 'accepted') {
      return NextResponse.json({ error: 'Please accept your allotted branch before submitting payment.' }, { status: 400 });
    }

    const data = await request.formData();
    const file = data.get('payment_receipt');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Set up directory in public folder
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // directory exists
    }

    // Save file with unique name
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${userId}-${Date.now()}.${fileExtension}`;
    const filePath = join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);

    const relativeUrl = `/uploads/${uniqueFilename}`;

    // Update database
    const updatedStudent = await prisma.student.update({
      where: { userId },
      data: {
        paymentReceipt: relativeUrl,
      },
    });

    return NextResponse.json({
      message: 'Receipt uploaded successfully.',
      student: updatedStudent,
    });
  } catch (error) {
    console.error('Payment receipt upload error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 401 });
  }
}
